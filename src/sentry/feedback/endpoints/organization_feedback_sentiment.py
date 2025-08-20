import logging

import requests
from django.conf import settings
from rest_framework.exceptions import ParseError
from rest_framework.request import Request
from rest_framework.response import Response

from sentry.api.api_owners import ApiOwner
from sentry.api.api_publish_status import ApiPublishStatus
from sentry.api.base import region_silo_endpoint
from sentry.api.bases.organization import OrganizationEndpoint, OrganizationPermission
from sentry.seer.signed_seer_api import sign_with_seer_secret
from sentry.utils import json

logger = logging.getLogger(__name__)

# Seer endpoint for sentiment analysis
SEER_SENTIMENT_URL = f"{settings.SEER_AUTOFIX_URL}/v1/automation/summarize/feedback/sentiment"


def make_seer_sentiment_request(feedback_message: str, organization_id: int) -> bytes:
    """Make a request to the Seer service for sentiment analysis."""
    request_data = {"organization_id": organization_id, "feedback_message": feedback_message}
    serialized_request = json.dumps(request_data)

    response = requests.post(
        SEER_SENTIMENT_URL,
        data=serialized_request,
        headers={
            "content-type": "application/json;charset=utf-8",
            **sign_with_seer_secret(serialized_request.encode()),
        },
        timeout=getattr(settings, "SEER_DEFAULT_TIMEOUT", 5),
    )

    if response.status_code != 200:
        logger.error(
            "Failed to analyze feedback sentiment",
            extra={
                "status_code": response.status_code,
                "response": response.text,
                "content": response.content,
            },
        )
        response.raise_for_status()

    return response.content


@region_silo_endpoint
class OrganizationFeedbackSentimentEndpoint(OrganizationEndpoint):
    owner = ApiOwner.FEEDBACK
    publish_status = {
        "POST": ApiPublishStatus.EXPERIMENTAL,
    }
    permission_classes = (OrganizationPermission,)

    def post(self, request: Request, organization) -> Response:
        """
        Get the sentiment analysis of a feedback message.

        Returns whether the feedback is positive, negative, or neutral based on AI analysis.

        :pparam string organization_id_or_slug: the id or slug of the organization.
        :auth: required

        Request body:
        {
            "feedback_message": "The feedback message to analyze"
        }

        Returns:
        {
            "sentiment": "positive" | "negative" | "neutral",
            "success": true
        }
        """
        feedback_message = request.data.get("feedback_message")
        if not feedback_message:
            raise ParseError(detail="Missing required field 'feedback_message'")

        # print("this is the feedback message", feedback_message)

        # Check if AI features are enabled for this organization
        # if not features.has(
        #     "organizations:user-feedback-ai-sentiment", organization, actor=request.user
        # ) or not has_seer_access(organization, actor=request.user):
        #     return Response(
        #         {"detail": "AI sentiment analysis is not available for this organization."},
        #         status=403,
        #     )

        try:
            # Call Seer for sentiment analysis
            response_data = json.loads(
                make_seer_sentiment_request(feedback_message, organization.id).decode("utf-8")
            )

            # Extract sentiment data from Seer response
            # Seer returns: {"data": {"sentiment": "positive"}}
            sentiment_data = response_data.get("data", {})
            sentiment = sentiment_data.get("sentiment")

            if not sentiment or sentiment not in ["positive", "negative", "neutral"]:
                logger.error(
                    "Seer returned invalid sentiment value",
                    extra={"sentiment": sentiment},
                )
                return Response({"detail": "Invalid sentiment analysis result"}, status=500)

            return Response(
                {
                    "sentiment": sentiment,
                    "success": True,
                }
            )

        except Exception as e:
            logger.exception(
                "Error analyzing feedback sentiment",
                extra={"error": str(e)},
            )
            return Response({"detail": "Error analyzing sentiment"}, status=500)
