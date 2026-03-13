**AI Product Operations – Take-Home Task** 

⏱ ![][image1]**Timebox:** Please spend **no more than 2 hours** on this task. 

This task is intentionally light on instruction. We’re interested in how you approach  problems where the solution isn’t clearly defined. 

**Context** 

Teams using short-form, media-heavy products (e.g. vertical video, cards, embeds)  often move quickly and publish at high volume. 

As volume increases, it becomes harder to maintain confidence that what’s being  published is consistent, professional, and trustworthy — especially when multiple  people and systems are involved. 

We don’t currently have a clear, scalable way of addressing this. You’ve been asked to  figure out how this problem could be addressed at scale. 

**What Exists Today** 

You have access to structured data representing recently created media items 

• This data: 

o updates continuously 

o exists at a scale where manual review does not work reliably 

• You may assume the data includes: 

o media assets (images / video) 

o text and metadata 

o contextual information 

(An example response will be provided. It is illustrative, not exhaustive.) **Your Task** 

**Decide how you would address the problem described above.** 

Specifically: 

• Identify what you think the *real issue* is 

• Decide what kind of system or mechanism would help 

• Build something that works at scale (i.e. not manually) 

You may: 

• use AI however you think is appropriate 

• make reasonable assumptions (call them out) 

• choose your own output format  
**Constraint** 

Whatever you build needs to work **repeatedly and automatically** from the data  provided \- One-off analysis or purely conceptual solutions are not sufficient. 

**What to Submit**  

Submit whatever best demonstrates 

• what you chose to build 

• that it runs automatically from the data 

• how AI was used to get there 

This might include 

• an example output 

• prompts or workflow steps 

• screenshots or diagrams 

• a short explanation of your decisions 

There is no required format. If helpful, you can also briefly touch on 

• how this might show up in the product over time 

• what you would build first with engineering support 

• what you would deliberately *not* build yet 

• You can include rough visuals if helpful (low-fidelity is fine). 

**Final Note** 

This task is intentionally open-ended. 

We’re interested in how you think, the assumptions you make, and the decisions you  prioritise — not whether you guess the “right” architecture  
**Example Endpoint Response (Illustrative Snippet)** 

You may assume your solution receives data similar to the example below. 

{ 

 "tenant\_id": "tenant\_antarctic\_league\_001", 

 "tenant\_name": "Antarctic Football League", 

 "last\_synced\_at": "2026-02-14T10:05:00Z", 

 "stories": \[ 

 { 

 "story\_id": "story\_123", 

 "story\_title": "Last 5 meetings: Penguin FC vs Seals United",  "pages": \[ 

 { 

 "page\_id": "page\_1", 

 "type": "video", 

 "asset\_url": "https://cdn.storyteller.com/assets/story\_123/page\_1.mp4",  "action": { 

 "cta": "Watch highlights", 

 "url": "https://antarcticfootballleague.com/match-report"  } 

 }, 

 { 

 "page\_id": "page\_2", 

 "type": "image", 

 "asset\_url": "https://cdn.storyteller.com/assets/story\_123/page\_2.jpg",  "action": { 

 "cta": "Buy tickets", 

 "url": "https://antarcticfootballleague.com/highlights"  } 

 } 

 \], 

 "context": { 

 "categories": \[ 

 "Penguin FC", 

 "Seals United", 

 "PFC v SU – 14/02/26" 

 \], 

 "tenant": "Antarctic Football League", 

 "publish\_date": "2026-02-14" 

 } 

 }, 

 { 

 "story\_id": "story\_124", 

 "story\_title": "Matchday build-up: PFC v SU",  
 "pages": \[ 

 { 

 "page\_id": "page\_1", 

 "type": "image", 

 "asset\_url": "https://cdn.storyteller.com/assets/story\_124/page\_1.jpg",  "action": { 

 "cta": "View lineup", 

 "url": "https://antarcticfootballleague.com/lineup"  } 

 }, 

 { 

 "page\_id": "page\_2", 

 "type": "video", 

 "asset\_url": "https://cdn.storyteller.com/assets/story\_124/page\_2.mp4",  "action": { 

 "cta": "Live match centre", 

 "url": "https://antarcticfootballleague.com/live"  } 

 } 

 \], 

 "context": { 

 "categories": \[ 

 "Penguin FC", 

 "Seals United", 

 "PFC v SU – 14/02/26", 

 "Matchday" 

 \], 

 "tenant": "Antarctic Football League", 

 "publish\_date": "2026-02-14" 

 } 

 } 

 \] 

}

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACK0lEQVR4Xq3Q3U+ScRQH8LO1XrZWN62/qLpo6w/ob2hra6s1cyaiiBMJcYNMpyggbzpAcMFQEOEBxA21MHt8MJzQg7wO5gtUrDhxfr0s86rZxWc7N9/vzjkQcLjgDLvrGnmlGe/U6iyd3GriOomtrcMp8QSAyzF7xpzNfIM87pRsPHrSsdmebxKnfRb+dib8zwW+ldXfPIHIRbNr8Xl3n6pAZH0vWr29Q62nXYNFMjbjlhhszlsWt/8+WQqvAQg7POzw7y+QBc+SW6VQ4sabJFMWs1jMZnFrW2CUimHsGRyr9kklWvJuKwkQCAbBH+IekBGlCk9O6thofGIq7YLC/h4e1z8zW3waVQo1zvu4hyTEcf+hIMKFQT81vU0EIYUn9TryqQ9MObuPpcwehsIcE40nMLG+ibpJHU/CoSCA2Th9RaVUfCWZTAabzSaKuRwT9nkw5vdiPn/A1Go1FAQB1aqhb8Rq0l8Fq9lwSdbf/4WIooiN9ga0BTmqlLBWyGG1VmXK5TIKPI863USTOOasl89fwK0sg0bzMky4aBwLuQM8PjxkqpUKC1V+ojDX/sXU5GSEBP2LAKFgAIz66btkwuRupdNp3N3dZUrFIhbyeUy17yZvk0l87fW19LqJe4SyYJkxgsX0g1Qi7VaP21oLXj+SeHwNo9EYehaXGZPd1VIMDPRYzSb45fwFHoPhlFGZ7La8Q+oiXc/kHyXyEXFoWOMmo1rtnXmnE/70HSCbw8RRuJWfAAAAAElFTkSuQmCC>