# Personal Game Project From Scratch

I'm still learning coding and I thought the best way to improve and learn new tools is to make a passion project.

With mainly just web development in my portfolio, I figured learning a new framework would be great to see how fast I can fully pick up something new.

I'm hoping this is also motivation to keep me coding. I've been applying to jobs with no success, but coding lives on.

## How does the Game work?

The game is a roguelike and raid simulator at the same time. Taking inspiration from popular roguelikes like Vampire Survivors, MegaBonk and Hades,
I wanted the game to have replay functionality. I've noticed that most of these games have very simple controls and barely any mechanics besides
moving around. I wanted this game to require more skill from the player, with leaderboards being the main goal for some players.

Taking more inspiration from Final Fantasy 14, I enjoyed the raid combat of dodging telegraphs, seeing castbars and reactively dodging to mechanics,
and hope to implement them in mine.

Visually speaking, I have zero experience in art. I'm hoping for a look close to Hollow Knight but Pixel.

Here's a closer look at what I plan the game to have:

**1. Skill Loop**

The player will start with 1 basic skill. Once they've attained enough EXP and level up, they may choose from a random list of upgrades.
These upgrades include new skills, increased general passive stats or further upgrades to their acquired skills.

**2. Boss Loop**

Similar to the player, the boss will level up over time. They will randomly acquire buffs as time progresses. After every milestone,
new bosses will spawn, completely changing the game with new mechanics.

**3. Game Loop**

When a player reaches 0hp, the game ends. The player is locked into only a certain number of skills. The player can restart and choose different
skills to help them on future runs if the last one didn't go as planned. Player will naturally learn the boss mechanics and find out the best
strategies to beat them.

## List of Skills 

```
BASIC:
- Slash: Melee Arc in front, low cd, med damage

- Arrow: Ranged auto, med cd, low damage

- Pulse: AOE multi, high cd, high damage

INTERMEDIATE:
- Thrust: Melee line w/ dash

- Caltrops: Placeable AOE DOT

- Fireball: Delayed circle AOE in front

- Devour: Melee cone that dmgs and heals player

- Hook: Ranged auto that pulls you to the boss.

- Volt: Boost move temporarily then aoe damage.

To ADD:

- Blood: AOE around player, Use HP to deal dmg
[Total: 15000pts]

- Yo-yo: Starts at 1 dmg, increases with each hit.
[Total: 9000pts]

- Javelin: Ranged, throw javelin set distance. Must be picked up to reset cd. 
[Highscore: 2500pts]

- Restoration: Instantly heal player, long cd
[Highscore: 500pts]

- Ward: Invulnerability for 1s.
[Highscore: 1500pts]

- Gust: Cone attack with knockback
[Total: 3000pts]

- Ironburst: shoot 3 pellets in direction
[Total: 6000pts]

- Laser: Bounce off wall to deal damage.
[Total: 12000pts]


```

