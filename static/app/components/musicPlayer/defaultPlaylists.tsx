import type {Playlist} from 'sentry/components/musicPlayer/musicPlayerContext';

const BASE_PLAYLISTS: Playlist[] = [
  {
    // Sentry-themed playlist
    id: 'sentaur-setlist',
    name: 'Sentaur Setlist',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
    },
    tracks: [
      {
        id: 'error-code-blues',
        title: 'Error Code Blues',
        artist: 'Sentaur',
        src: '/_static/dist/sentry/assets/songs/error_code_blues.mp3',
        lyrics: `[Verse]
The chart won't load it's stuck in time
Fetch_metric_issue ain't doing fine
A ghostly endpoint nowhere to find
404 it's left me blind

[Prechorus]
I'm chasing data down a dead-end street
Error codes where solutions meet

[Chorus]
Oh 404 you shut the door
To the numbers that I'm looking for
Oh 404 you're breaking my core
This API don't work no more

[Verse 2]
Lines of code they run and crawl
But hit a wall no use at all
A phantom call no protocol
This broken link it haunts us all

[Bridge]
Can't debug what's not alive
I'm just trying to make it thrive
An endpoint lost in the digital hive
Fix it up so we can survive

[Chorus]
Oh 404 you shut the door
To the numbers that I'm looking for
Oh 404 you're breaking my core
This API don't work no more`,
      },
      {
        id: 'bufo-journey',
        title: "Bufo's Journey",
        artist: 'Bufo',
        src: '/_static/dist/sentry/assets/songs/bufo_journey.mp3',
        lyrics: `[Verse]
Bufo hopped out at the crack of dawn
Pixels shimmered on the forest lawn
A little frog with a mighty dream
To light the code with a brighter gleam

[Prechorus]
Step by step through the tangled vines
Feedback flows like golden lines

[Chorus]
Pixels matter Bufo knows
Every leap helps progress grow
Work in progress that's the way
Value people every day

[Verse 2]
Through the swamp and the data streams
Bufo listened to the quiet beams
Errors croaked but he took them in
Every bug a chance to win

[Prechorus]
Hopping higher fixing flaws
One small leap for a greater cause

[Chorus]
Pixels matter Bufo knows
Every leap helps progress grow
Work in progress that's the way
Value people every day`,
      },
      {
        id: 'error-slayer',
        title: 'Error Slayer',
        artist: 'Sentaur',
        src: '/_static/dist/sentry/assets/songs/error_slayer.mp3',
        lyrics: `[Verse]
Lines of code like a web in the night
Caught in the trap but I'm ready to fight
Digits scream in a binary roar
It's me or the stack
Can't take anymore

[Prechorus]
Loops and calls
They twist
They bind
Logic slipping
Losing time
But I see through the glitch's haze

[Chorus]
Error slayer
Cutting through the dark
Stack is tumbling
I'll leave my mark
Byte by byte
I break the chains
Victory's mine
No more pain

[Verse 2]
The villain laughs
A digital snare
Null-pointer stare
It's everywhere
Recursive shadows
They rise and fall
But I'm the firewall to end it all

[Bridge]
Echoes of 404s
A haunted refrain
But I reboot my strength
Rewire the pain
Syntax rebels
Commands collide
But in this battle
I won't hide

[Chorus]
Error slayer
Cutting through the dark
Stack is tumbling
I'll leave my mark
Byte by byte
I break the chains
Victory's mine
No more pain`,
      },
    ],
  },
  {
    id: 'minecraft-vibes',
    name: 'Minecraft Vibes',
    theme: {
      primaryColor: '#22c55e',
      secondaryColor: '#84cc16',
    },
    tracks: [
      {
        id: 'minecraft-1',
        title: 'Debugging Zen',
        artist: 'Craft Master',
        src: '/_static/dist/sentry/assets/songs/debugging_zen.mp3',
        lyrics: `[Verse]
Lines of code like falling rain
A maze of thoughts inside my brain
Error whispers
Soft and sly
Where’s the bug
The reason why?

[Prechorus]
I breathe
I sift
I try to see
A clearer path to set it free

[Chorus]
For every dev
A guiding light
Sentry catches in the night
Error trapped
The logs unfold
A story written
Truth retold

[Verse 2]
Variables hide in shadowed halls
Functions echo
Distant calls
Loops that spin
A timeless dance
Debugging's rhythm
Second chance

[Prechorus]
The stack unwinds
The truth appears
No more silence
No more fears

[Chorus]
For every dev
A guiding light
Sentry catches in the night
Error trapped
The logs unfold
A story written
Truth retold`,
      },
      {
        id: 'minecraft-2',
        title: 'Redstone Circuit',
        artist: 'Pixel Builder',
        src: '/_static/dist/sentry/assets/songs/redstone_circuit.mp3',
      },
    ],
  },
];

// Shuffle tracks within each playlist once on module load, then keep them in that order for the session
export const DEFAULT_PLAYLISTS: Playlist[] = BASE_PLAYLISTS.map(playlist => ({
  ...playlist,
  tracks: [...playlist.tracks].sort(() => Math.random() - 0.5),
}));
