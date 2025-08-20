import type {Track} from 'sentry/components/musicPlayer/musicPlayerContext';

// Map of product IDs to their inspired tracks
export const PRODUCT_TRACKS: Record<string, Track[]> = {
  issues: [
    {
      id: 'issues-1',
      title: 'Bug Hunt Blues',
      artist: 'Debug Detective',
      src: '/_static/dist/sentry/assets/songs/issues1.mp3',
    },
    {
      id: 'issues-2',
      title: 'Error Stack Hype',
      artist: 'Debug Detective',
      src: '/_static/dist/sentry/assets/songs/error_stack_hype.mp3',
      lyrics: `[Verse]
Code crash, brain mash, numbers in a car crash,
Stack trace runnin' laps, my debugger do the dash,
404 in my soul, but I'm huntin' for the gold,
Found a gem in the logs, now the story's gettin' told.

Catch me scrollin' through the flame charts,
Fire in the errors, I'm decipherin' the dark parts,
Error message lookin' cryptic, hieroglyphic,
Turn the glitch to a fix, yeah, prolific.

[Chorus]
Sentry ping, I'm alert to the game,
Transaction flow, I'm collectin' the gains,
Error leads to the treasure, that's strange,
Break it, then I build it—never stay the same.

[Verse 2]
Transaction logs, bread crumbs on a trail,
Debuggin' like a hacker, every clue never stale,
Data flowin' like a current, electric in my veins,
Error stack got me hyped, I'm addicted to the pain.

Breakpoints poppin' like confetti,
Hit the right line, now my fix game steady,
Trace it back, see the history unwind,
Turn a bug to a feature, now the code divine.

[Bridge]
Infinite loops, but my brain never stuck,
Spinnin' cycles into gold, I'm just pushin' my luck,
Errors in the night, but I'm findin' the light,
Transaction complete, yeah, the future lookin' bright.`,
    },
    {
      id: 'issues-3',
      title: 'Error in My Heart',
      artist: 'Debug Detective',
      src: '/_static/dist/sentry/assets/songs/error_in_my_heart.mp3',
      lyrics: `[Verse 1]
I typed out the words, but they came out wrong,
Your love was the code I couldn't belong.
Now I'm staring at the screen of my mistakes,
Every line I wrote, another heart it breaks.

[Prechorus]
I can't debug the pain I caused,
Every step forward, I'm more lost.

[Chorus]
There's an error in my heart, I can't rewrite,
I keep crashing in the dark, no end in sight.
I'm a glitch in your love, falling apart,
And I don't know how to fix this error in my heart.

[Verse 2]
I tried to patch the cracks, but the seams won't hold,
Your silence is a code that's bitter and cold.
I'm a broken program, looping in regret,
The love we built's a file I can't reset.

[Prechorus]
I've run out of chances, run out of tries,
Still searching for answers in your eyes.

[Chorus]
There's an error in my heart, I can't rewrite,
I keep crashing in the dark, no end in sight.
I'm a glitch in your love, falling apart,
And I don't know how to fix this error in my heart.`,
    },
  ],
  replays: [
    {
      id: 'replays-1',
      title: 'Rewind & Replay',
      artist: 'Session Detective',
      src: '/_static/dist/sentry/assets/songs/replay1.mp3',
    },
    {
      id: 'replays-2',
      title: 'Agatha Christie Mystery',
      artist: 'Session Detective',
      src: '/_static/dist/sentry/assets/songs/session_shadows.mp3',
      lyrics: `[Verse]
Fingers dance on phantom keys
A trail of whispers through the breeze
Click by click
A silent spree
Are you watching
Or is it me

[Prechorus]
Every scroll
Every stray
The shadows tell where you stray

[Chorus]
Session shadows
Ghostly play
I see the paths
The games you lay
Your mind's a maze
I chase
I sway
Session shadows
Night turns gray

[Verse 2]
Loops of thought in endless thread
Patterns drawn from what's unsaid
Each decision
Each misstep
Maps your soul
The codes are kept

[Prechorus]
Every flicker
Every stall
I'm behind the mirrored wall

[Chorus]
Session shadows
Ghostly play
I see the paths
The games you lay
Your mind's a maze
I chase
I sway
Session shadows
Night turns gray`,
    },
  ],
  // performance: [
  //   {
  //     id: 'performance-placeholder',
  //     title: 'lLightning Fast',
  //     artist: 'Speed Optimizer',
  //     src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
  //   },
  // ],
  'issues/feedback': [
    {
      id: 'feedback-1',
      title: 'User Voice from the Depths',
      artist: 'Tired Developer',
      src: '/_static/dist/sentry/assets/songs/feedback1.mp3',
      sentiment: 'neutral',
    },
    {
      id: 'feedback-2',
      title: 'Feedback Symphony',
      artist: 'Tired Developer',
      src: '/_static/dist/sentry/assets/songs/feedback_symphony.mp3',
      sentiment: 'neutral',
      lyrics: `[Verse]
They say it's smooth like butter
A dance on glass
But some call it glitchy
A system crash
Windows here
Mac over there
Different browsers
A cross-platform affair

[Prechorus]
Click and type
They let it spill
Stars or none
They've got the will

[Chorus]
Feedback's rolling in
The good and the bad
Breadcrumbs trailing back to the tags we had
Replay the moment
Hear what they say
From the OS world to the browser ballet

[Verse 2]
Chrome shines bright
Firefox holds the line
Safari whispers secrets
Edge takes its time
They point to the lag
Or praise the speed
Every comment's a puzzle
A data seed

[Bridge]
Some shout loud
"It's a masterpiece"
Others grumble low
"Fix this piece"
Breadcrumb trails of where they've been
Each word a clue
Let the solving begin

[Chorus]
Feedback's rolling in
The good and the bad
Breadcrumbs trailing back to the tags we had
Replay the moment
Hear what they say
From the OS world to the browser ballet`,
    },
    {
      id: 'feedback-3',
      title: 'Happy users',
      artist: 'Happy Developer',
      src: '/_static/dist/sentry/assets/songs/feedback_positive1.mp3',
      sentiment: 'positive',
    },
    {
      id: 'feedback-4',
      title: 'Sad users',
      artist: 'Sad Developer',
      src: '/_static/dist/sentry/assets/songs/feedback_negative1.mp3',
      sentiment: 'negative',
    },
  ],
  discover: [
    {
      id: 'discover-1',
      title: 'Queries in the Dark',
      artist: 'Query Carrie',
      src: '/_static/dist/sentry/assets/songs/queries_in_the_dark.mp3',
      lyrics: `[Verse]
Lines of code like maps to stars
Fingers trace the scars of old wars
Whispers buried in the machine
Is it real or just a dream unseen

[Chorus]
Queries in the dark I'm asking why
Digging through the wreckage of a lullaby
Tell me what's hidden tell me what's true
In the code in the cracks in the residue

[Verse 2]
Answers come like smoke in the air
Choking questions but they're still there
Patterns flicker like a neon ghost
Do we build or break what we need most

[Prechorus]
I reach out I reach through
But what am I reaching to

[Chorus]
Queries in the dark I'm asking why
Digging through the wreckage of a lullaby
Tell me what's hidden tell me what's true
In the code in the cracks in the residue

[Bridge]
Lines and loops circles and squares
The way it moves feels unfair
Searching for meaning in binary streams
But the truth's tangled in electric dreams`,
    },
    {
      id: 'discover-2',
      title: 'Into the Unknown',
      artist: 'Query Carrie',
      src: '/_static/dist/sentry/assets/songs/into_the_unknown.mp3',
    },
  ],
  insights: [
    {
      id: 'insights-1',
      title: 'Mind Reader',
      artist: 'Analytics Wizard',
      src: '/_static/dist/sentry/assets/songs/insights1.mp3',
    },
  ],
  alerts: [
    {
      id: 'alerts-1',
      title: 'Wake Up Call',
      artist: 'Incident Captain',
      src: '/_static/dist/sentry/assets/songs/alerts1.mp3',
    },
    {
      id: 'alerts-2',
      title: 'Replay Count Failure',
      artist: 'Incident Captain',
      src: '/_static/dist/sentry/assets/songs/replay_count_failure.mp3',
      lyrics: `[Verse]
Red lights flash
Alarms arise
The system screams
It won't comply
Replay counts
They spiral down
Failure stalks
It claims the crown

[Chorus]
Replay failed! Replay failed!
Error codes have now prevailed!
Chaos reigns
The wires fray
Triage screams
We can't delay!

[Verse 2]
Lines of code
A twisted maze
Endless loops
A fiery blaze
Logic broken
Torn apart
Fix the beast
Restart the heart

[Prechorus]
Logs explode like cannon fire
Answers lost in a digital pyre

[Chorus]
Replay failed! Replay failed!
Error codes have now prevailed!
Chaos reigns
The wires fray
Triage screams
We can't delay!

[Bridge]
Silent screens
The curse unfolds
Data lost in darkened folds
Analyze
Dissect the pain
Harness power
Break the chain`,
    },
  ],
  dashboards: [
    {
      id: 'dashboards-1',
      title: 'Chart Topper',
      artist: 'Dashboard Diva',
      src: '/_static/dist/sentry/assets/songs/dashboards.mp3',
    },
    {
      id: 'dashboards-2',
      title: 'Data Love',
      artist: 'Dashboard Diva',
      src: '/_static/dist/sentry/assets/songs/data_love.mp3',
      lyrics: `[Verse 1]
I see the numbers they glow at night
A little spark a guiding light
Whispers in code they tell me you're near

[Prechorus]
Every tap every slide
Shows the heart you can't hide
Oh baby your truth is clear

[Chorus]
Data love it never lies
Through the screen I see your skies
Every move every glance
Tells a story of our dance

[Verse 2]
Metrics like stars they chart your way
A universe in shades of gray
The truth of us in patterns and lines

[Prechorus]
Clicks and swipes they don't pretend
Every journey finds its end
Your heartbeat syncs with mine

[Chorus]
Data love it never lies
Through the screen I see your skies
Every move every glance
Tells a story of our dance`,
    },
  ],
  // projects: [
  //   {
  //     id: 'projects-placeholder',
  //     title: 'lProject Anthem',
  //     artist: 'Team Builder',
  //     src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
  //   },
  // ],
  traces: [
    {
      id: 'traces-1',
      title: 'Trace Maze',
      artist: 'Trace Detective',
      src: '/_static/dist/sentry/assets/songs/trace_maze.mp3',
      lyrics: `[Verse]
Dusty trails in the code unwind
Lines and loops they twist and bind
Packets whisper secrets faint and kind

[Prechorus]
Oh the echo of the unseen
A ghost in the machine

[Chorus]
Reading a trace
Through the maze I race
Every byte
Every space
I'm reading a trace

[Verse 2]
Threads collide like dancers lost
Every glitch comes with a cost
A tango of zeros that leaves me tossed

[Bridge]
Binary shadows fall and rise
In the server's quiet cries
I see the world behind its eyes

[Chorus]
Reading a trace
Through the maze I race
Every byte
Every space
I'm reading a trace`,
    },
  ],
  logs: [
    {
      id: 'logs-1',
      title: 'Reading the Lines',
      artist: 'Country Boy Coder',
      src: '/_static/dist/sentry/assets/songs/reading_the_lines.mp3',
      lyrics: `[Verse 1]
Out in the shed with a coffee in hand,
Dust on the keys, but I've got a plan.
Logs on the screen, they're talkin' to me,
Lines of a language only I can see.

[Chorus]
I'm reading the lines, oh, I'm cracking the code,
Finding the paths where the errors explode.
Severity's shouting, the message is clear,
Each little log's got a story to steer.

[Verse 2]
Warnings flash yellow, errors burn red,
Info's the whisper, the calm in my head.
A timestamp's a trail, a breadcrumb to find,
The heartbeat of systems, the pulse in the lines.

[Prechorus]
What's the tale they're tryin' to tell?
A cry for help or all is well?

[Chorus]
I'm reading the lines, oh, I'm cracking the code,
Finding the paths where the errors explode.
Severity's shouting, the message is clear,
Each little log's got a story to steer.

[Bridge]
Somewhere in the stack is a reason why,
A lonely old string, a forgotten try.
Logs are like maps, they lead me through,
To the heart of the problem, the answers in view.`,
    },
    {
      id: 'logs-2',
      title: 'Logs in the Rearview',
      artist: 'Country Boy Coder',
      src: '/_static/dist/sentry/assets/songs/logs_in_the_rearview.mp3',
      lyrics: `[Verse 1]
Stacked like hay bales, lines on the screen,
Errors and warnings, a coder's routine.
Red lights flash, but I don't slow down,
I'm the fastest log-reader this side of town.

[Prechorus]
Rolling through the clutter, finding gold in the grime,
Every error's just a riddle, and I solve 'em in no time.

[Chorus]
Logs in the rearview, dust in the air,
Breaking down the chaos without a care.
Through the noise and the clutter, I carve my way,
Victory's my anthem, and I'm king today.

[Verse 2]
Filters flying, regex in hand,
Sorting through the rubble like I own this land.
Bytes and bugs, they can't hide from me,
I'm a digital cowboy, riding code so free.

[Prechorus]
Saddle up the console, I'm blazing the trail,
Every error tamed like a horse with no tail.

[Chorus]
Logs in the rearview, dust in the air,
Breaking down the chaos without a care.
Through the noise and the clutter, I carve my way,
Victory's my anthem, and I'm king today.`,
    },
  ],
  profiles: [
    {
      id: 'profiles-1',
      title: 'Heartbreak Algorithms',
      artist: 'Depressed Developer',
      src: '/_static/dist/sentry/assets/songs/heartbreak_algorithms.mp3',
      lyrics: `[Verse]
I scrolled your life in a data stream
Click by click
A fractured dream
You bought flowers
But not for me

[Prechorus]
Your cart's a mystery
Full of clues
A broken heart in pay-per-use

[Chorus]
Heartbreak algorithms
Never lie
They sort the love
But I'm denied
Optimized for someone else's touch
And here I am
Left with too much

[Verse 2]
A pattern forms in your spending spree
Candlelit dinners
Not meant for me
Every transaction
A knife so keen

[Prechorus]
Your choices
They sting like code
A sequence I'll never decode

[Chorus]
Heartbreak algorithms
Never lie
They sort the love
But I'm denied
Optimized for someone else's touch
And here I am
Left with too much`,
    },
    {
      id: 'profiles-2',
      title: 'Profiled and Regressed',
      artist: 'Panic! at the Profiler',
      src: '/_static/dist/sentry/assets/songs/profiled_and_regressed.mp3',
      lyrics: `[Verse]
We built it up with logic and fire
Lines of code climbing higher and higher
But now the cracks are showing
Can't deny
Our functions faltered
Left to die

[Prechorus]
Debugging dreams in a sleepless haze
Tracing ghosts through a broken maze

[Chorus]
Profiled and regressed
Oh
We're such a mess
Every test we run just adds more stress
Profiled and regressed
Can't catch a breath
This loop we're in feels worse than death

[Verse 2]
The compiler screams
A banshee's wail
Error logs like a tragic tale
We thought we knew the algorithm's heart
But it's tearing us apart

[Prechorus]
Call stack collapses
Drowning in despair
Infinite loops spinning everywhere

[Chorus]
Profiled and regressed
Oh
We're such a mess
Every test we run just adds more stress
Profiled and regressed
Can't catch a breath
This loop we're in feels worse than death`,
    },
  ],
  // explore: [
  //   {
  //     id: 'explore-placeholder',
  //     title: 'lAdventure Time',
  //     artist: 'Data Explorer',
  //     src: 'https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3',
  //   },
  // ],
  releases: [
    {
      id: 'releases-1',
      title: 'Ship It!',
      artist: 'Release Captain',
      src: '/_static/dist/sentry/assets/songs/releases1.mp3',
    },
    {
      id: 'releases-2',
      title: 'Backend Beat',
      artist: 'Release Captain',
      src: '/_static/dist/sentry/assets/songs/backend_beat.mp3',
      lyrics: `[Verse]
Code is clean now ship it fast
Push the limits make it last
Every bug we crushed it dead
No more ghosts inside the thread

[Prechorus]
Lines of logic spinning tight
Bright like neon in the night

[Chorus]
Backend beat yeah feel the fire
Rising higher higher higher
Backend beat the future's here
Raise a cheer let's engineer

[Verse 2]
Functions flowing sleek and smooth
No more glitches we improved
Pipelines dancing streams aligned
Built to thrive in overtime

[Prechorus]
Data pulses in the glow
We're the rhythm watch it flow

[Chorus]
Backend beat yeah feel the fire
Rising higher higher higher
Backend beat the future's here
Raise a cheer let's engineer`,
    },
  ],
  settings: [
    {
      id: 'settings-1',
      title: 'Configuration Station',
      artist: 'Settings Master',
      src: '/_static/dist/sentry/assets/songs/settings1.mp3',
    },
  ],

  // Insights sub-products
  crons: [
    {
      id: 'crons-1',
      title: 'Tick Tock Clock',
      artist: 'Cron Commander',
      src: '/_static/dist/sentry/assets/songs/cron1.mp3',
    },
  ],
  uptime: [
    {
      id: 'uptime-1',
      title: 'Groove Patrol: Uptime Vibes',
      artist: 'Uptime Guardian',
      src: '/_static/dist/sentry/assets/songs/groove_patrol_uptime_vibes.mp3',
      lyrics: `[Verse]
Tick-tock
It's uptime o'clock (oo-yeah!)
Bassline's struttin'
Make the floor rock
Didgeridoo hummin'
Deep in the groove
Hey now
Watch it
Watch it
Don't you snooze

[Chorus]
Uptime monitor
Keep it alive
(Keep it alive, keep it alive!)
Funky signals
Rhythm in the drive
(Hey now, hey now, we thrive!)
Uptime monitor
Hummin' the tune
Catch that vibe
We'll funk till noon

[Verse 2]
Wiggle that wire
Shake the screen (oo-oo!)
Data flowin'
Like a groove machine
Check the pings
It's all green lights
(Oh, yeah, we jammin' all night!)

[Bridge]
Didgeridoo low
Bassline tight
Funk in the air
It feels so right
(So right, so right!)
Clap your hands
Now stomp your feet
Monitor the beat
It's uptime heat

[Chorus]
Uptime monitor
Keep it alive
(Keep it alive, keep it alive!)
Funky signals
Rhythm in the drive
(Hey now, hey now, we thrive!)
Uptime monitor
Hummin' the tune
Catch that vibe
We'll funk till noon

[Outro]
Tick-tock
It's uptime o'clock (oo-yeah!)
Bass and didge
They never stop
Hey now
Monitor
Keep it tight
We're groovin' on into the night!`,
    },
  ],
  frontend: [
    {
      id: 'frontend-1',
      title: 'Shattered Speed Dreams',
      artist: 'Depressed Developer',
      src: '/_static/dist/sentry/assets/songs/shattered_seconds.mp3',
      lyrics: `[Verse]
Pixels crawling slow like molasses in rain
I chase the flicker but it hides again
Numbers in red screaming out in pain
Why won't the load just fade?

[Prechorus]
Shadows lagging trailing ghosts
A nightmare wrapped in code I wrote

[Chorus]
Shattered seconds tearing through the night
Every blink a battle every frame a fight
Chasing speed chasing light
Frontend whispers burning bright

[Verse 2]
A script too heavy a call too late
My browser groans under all that weight
Rendering dreams lost to cruel debate
Why won't it all just break?

[Prechorus]
Threads collide in a twisted mess
Performance drowning under duress

[Chorus]
Shattered seconds tearing through the night
Every blink a battle every frame a fight
Chasing speed chasing light
Frontend whispers burning bright`,
    },
  ],
  backend: [
    {
      id: 'backend-1',
      title: 'Server Side Story',
      artist: 'Backend Boss',
      src: '/_static/dist/sentry/assets/songs/server_side_story.mp3',
      lyrics: `[Verse]
Code runs deep like a hidden stream
Functions stack
It's a backend dream
CPU scream
Got the cores on fire
Latency low
We take it higher

Queries crunch
Midnight crunching back
Data flows smooth
No room to crack
Logs don't lie
They tell the tale
Backend wins where the front may fail

[Prechorus]
Server's humming
Like a beast alive
Packets racing
In a data drive

[Chorus]
Server side story
I'm the boss in the code
Load balancers ready
Watch the traffic explode
Server side story
Speed's my creed
Every byte
Every cycle
Feeds my need

[Verse 2]
Caching layers like a fortress wall
Miss my cache? Nah
I catch it all
Endpoints hit
They knock my door
API flex
They beg for more

Scaling up
When the load goes wild
Clouds stack high
But I'm still styled
Ping so low
It whispers back
Backend king
Never lose the track`,
    },
  ],
  mobile: [
    {
      id: 'mobile-1',
      title: 'App Ascension',
      artist: 'Depressed Developer',
      src: '/_static/dist/sentry/assets/songs/app_ascension.mp3',
      lyrics: `[Verse]
Swiping up through the peaks and the lows
A mountain of numbers nobody knows
Glitching stars
A pixel parade
The data speaks
A masquerade

[Chorus]
Insights
They bite
They fight
They climb
Rankings rise
Rankings fall
No reason or rhyme
Top ten
Top five
Top one
Then none
The app ascends
Then comes undone

[Verse 2]
Graphs that dance
Jagged and sly
A chart's a liar
But it won't deny
Echoes in metrics
A silent refrain
What's up today could drown in rain

[Prechorus]
Push it higher
Make it sing
Numbers are a fleeting king

[Chorus]
Insights
They bite
They fight
They climb
Rankings rise
Rankings fall
No reason or rhyme
Top ten
Top five
Top one
Then none
The app ascends
Then comes undone

[Bridge]
A crash
A freeze
A spinning wheel
The leaderboard laughs at how you feel
Binary dreams and fragmented streams
Performance is crueler than it seems`,
    },
  ],
  'ai-agents': [
    {
      id: 'ai-agents-1',
      title: 'Seer Speeds Ahead',
      artist: 'Seer',
      src: '/_static/dist/sentry/assets/songs/seer_speeds_ahead.mp3',
      lyrics: `[Verse]
Out of the circuits
Out of the blue
Seer's got the answers faster than you
No maps
No plans
Just endless code
Breaking the locks on every road

[Prechorus]
Wires hum
The sparks collide
Seer's the one who turns the tide

[Chorus]
Seer
Seer
Speeds ahead
A thousand thoughts in a single thread
Fixing what's broken
Making it clear
World on fire
Here comes Seer

[Verse 2]
Chasing the chaos
Rewriting the sky
Numbers and data
Never asks why
No sleep
No rest
Just endless drive
Seer's the reason problems survive

[Prechorus]
Blades of light
Cutting through
Seer's the force that always knew

[Chorus]
Seer
Seer
Speeds ahead
A thousand thoughts in a single thread
Fixing what's broken
Making it clear
World on fire
Here comes Seer`,
    },
  ],
  agents: [
    {
      id: 'ai-agents-1',
      title: 'Seer Speeds Ahead',
      artist: 'Seer',
      src: '/_static/dist/sentry/assets/songs/seer_speeds_ahead.mp3',
      lyrics: `[Verse]
Out of the circuits
Out of the blue
Seer's got the answers faster than you
No maps
No plans
Just endless code
Breaking the locks on every road

[Prechorus]
Wires hum
The sparks collide
Seer's the one who turns the tide

[Chorus]
Seer
Seer
Speeds ahead
A thousand thoughts in a single thread
Fixing what's broken
Making it clear
World on fire
Here comes Seer

[Verse 2]
Chasing the chaos
Rewriting the sky
Numbers and data
Never asks why
No sleep
No rest
Just endless drive
Seer's the reason problems survive

[Prechorus]
Blades of light
Cutting through
Seer's the force that always knew

[Chorus]
Seer
Seer
Speeds ahead
A thousand thoughts in a single thread
Fixing what's broken
Making it clear
World on fire
Here comes Seer`,
    },
  ],
};

/**
 * Get tracks for a given product ID
 */
export function getTracksForProduct(productId: string | undefined): Track[] {
  if (!productId) return [];
  return PRODUCT_TRACKS[productId] || [];
}
