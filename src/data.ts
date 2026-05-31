import { UserStats, ScriptureVerse, Prayer, Mission, PathStage, ReadingPlan, CurriculumPlan } from "./types";

export const DEFAULT_USER_STATS: UserStats = {
  username: "Seeker",
  avatarUrl: "",
  completedMissionsCount: 0,
  currentStreak: 0,
  level: 1,
  checklist: {
    prayer: false,
    word: false,
    obedience: false,
  },
};

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "john21",
    title: "21 Days in John",
    description: "Walk through the Gospel of John — the life, words, and signs of Jesus — one passage at a time.",
    totalDays: 21,
    theme: "The Life of Jesus",
  },
  {
    id: "psalms14",
    title: "14 Days of Psalms",
    description: "A two-week journey through praise, lament, trust, and rest in the Psalms.",
    totalDays: 14,
    theme: "Faith & Rest",
  },
  {
    id: "disciple30",
    title: "30-Day Discipleship Path",
    description: "Foundational passages on what it means to follow Christ — identity, obedience, mission, and community.",
    totalDays: 30,
    theme: "Following Christ",
  },
];

export const ALL_VERSES: ScriptureVerse[] = [
  // ── 21 DAYS IN JOHN ──────────────────────────────────────────────────────
  {
    id: "john-01", planId: "john21", dayNumber: 1, totalDays: 21,
    reference: "John 1:1-5",
    verseLines: [
      "\"In the beginning was the Word, and the Word was with God, and the Word was God.\"",
      "\"He was with God in the beginning. Through him all things were made; without him nothing was made that has been made.\"",
      "\"In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it.\""
    ],
    simpleMeaning: "Jesus existed before creation. He is not just a teacher or prophet — He is the eternal Word of God who entered our world as the source of all life and light.",
    context: "John opens his Gospel not with a birth narrative but with eternity. The phrase 'In the beginning' echoes Genesis 1:1, deliberately linking Jesus to the creation account and establishing His divine identity before a single miracle is performed.",
    application: "Start this plan by sitting with the weight of who Jesus is — not just a moral guide but the very Author of life. Let that shift how you approach today's decisions.",
    reflection: "The darkness has never overcome the light. Whatever season you are in, that promise holds.",
    actionStep: "Write one sentence: what does it mean to you personally that Jesus is the light of the world?",
  },
  {
    id: "john-02", planId: "john21", dayNumber: 2, totalDays: 21,
    reference: "John 1:14",
    verseLines: [
      "\"The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.\""
    ],
    simpleMeaning: "God did not watch humanity from a distance. He entered human experience fully — skin, hunger, grief, joy — to dwell with us.",
    context: "The word translated 'dwelling' literally means 'pitched his tent among us,' echoing the Tabernacle of Moses where God's presence rested. John is saying: Jesus is the new Tabernacle — the place where humanity meets God.",
    application: "Because Jesus took on flesh, nothing in your human experience is foreign to Him. Bring the most ordinary parts of your day to Him in prayer today.",
    reflection: "Full of grace and truth — not one at the expense of the other. Jesus never compromised truth to be kind, nor harshness in the name of truth.",
    actionStep: "Pray through one area of your life where you need both grace and truth from God today.",
  },
  {
    id: "john-03", planId: "john21", dayNumber: 3, totalDays: 21,
    reference: "John 3:16-17",
    verseLines: [
      "\"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.\"",
      "\"For God did not send his Son into the world to condemn the world, but to save the world through him.\""
    ],
    simpleMeaning: "God's motivation for sending Jesus was love, not judgment. The mission was rescue, not condemnation.",
    context: "Jesus says this in a private nighttime conversation with Nicodemus, a Pharisee who came seeking truth but needed his entire framework of earning God's favor dismantled. These verses are the axis of the entire Gospel.",
    application: "Meditate on the word 'gave' — God gave His most precious possession freely. How does receiving that gift shape how freely you give to others today?",
    reflection: "The world God loved includes the parts of yourself you find hardest to love.",
    actionStep: "Write down the name of someone who needs to hear that God's posture toward them is rescue, not condemnation.",
  },
  {
    id: "john-04", planId: "john21", dayNumber: 4, totalDays: 21,
    reference: "John 4:13-14",
    verseLines: [
      "\"Jesus answered, 'Everyone who drinks this water will be thirsty again, but whoever drinks the water I give them will never thirst.'\"",
      "\"Indeed, the water I give them will become in them a spring of water welling up to eternal life.\""
    ],
    simpleMeaning: "Everything the world offers satisfies temporarily. Jesus offers a different kind of satisfaction — one that becomes its own ongoing source rather than something you deplete.",
    context: "This exchange happens with a Samaritan woman at Jacob's Well — a remarkable scene. Jesus crosses every social boundary of His day (gender, ethnicity, reputation) to offer living water to someone the religious culture had discarded.",
    application: "What are you drinking from that keeps leaving you thirsty? Identify one substitute source of satisfaction and bring it to Jesus honestly today.",
    reflection: "The spring wells up from within — it's not a reservoir you top up, it's a source you carry.",
    actionStep: "Spend 5 minutes in silence. Ask God: 'What is one false source of satisfaction I keep returning to?'",
  },
  {
    id: "john-05", planId: "john21", dayNumber: 5, totalDays: 21,
    reference: "John 6:35",
    verseLines: [
      "\"Then Jesus declared, 'I am the bread of life. Whoever comes to me will never go hungry, and whoever believes in me will never be thirsty.'\""
    ],
    simpleMeaning: "Just as bread sustains physical life daily, Jesus sustains spiritual life. This is not a one-time encounter — it is daily nourishment.",
    context: "The day after feeding five thousand people with five loaves, the crowd follows Jesus hoping for more food. He redirects their physical appetite toward a deeper hunger — and offers Himself as the answer.",
    application: "Daily bread requires daily coming. Where in your routine can you add one deliberate moment of coming to Jesus today?",
    reflection: "The crowd wanted a miracle. Jesus offered a relationship. He still does.",
    actionStep: "Set a daily reminder on your phone — a specific time to open Scripture or pray. That is coming for bread.",
  },
  {
    id: "john-06", planId: "john21", dayNumber: 6, totalDays: 21,
    reference: "John 8:12",
    verseLines: [
      "\"When Jesus spoke again to the people, he said, 'I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.'\""
    ],
    simpleMeaning: "Jesus offers a way of seeing — a perspective on life that illuminates what was confusing or dark. Following Him brings clarity, not blindness.",
    context: "Jesus says this in the Temple courts during the Feast of Tabernacles, where giant menorahs lit up Jerusalem. The crowd would have understood the image immediately — He is claiming to be what those lights symbolized: God's presence.",
    application: "Is there an area of your life right now where you feel you're walking in the dark — confused, uncertain, or afraid? Bring it to the Light today.",
    reflection: "The promise is not that the path becomes easy, but that you can see it.",
    actionStep: "Write down one decision you're currently uncertain about. Ask God to shine light on it, then watch and listen.",
  },
  {
    id: "john-07", planId: "john21", dayNumber: 7, totalDays: 21,
    reference: "John 10:10-11",
    verseLines: [
      "\"The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.\"",
      "\"I am the good shepherd. The good shepherd lays down his life for the sheep.\""
    ],
    simpleMeaning: "There is a stark contrast between forces that want to diminish your life and the Shepherd who gave His to protect yours. Full life is God's intention for you.",
    context: "Jesus contrasts Himself with religious leaders who were exploiting the people. The 'full life' He describes is not material prosperity but zoe — the God-quality life that begins now and extends into eternity.",
    application: "List three areas where you feel life is being stolen from you — joy, peace, purpose. Bring each one to the Good Shepherd today.",
    reflection: "A good shepherd doesn't merely manage the flock from a distance. He gets between the wolf and the sheep.",
    actionStep: "Pray: 'Jesus, I identify these thieves in my life — show me how to walk in the fullness you promised.'",
  },
  {
    id: "john-08", planId: "john21", dayNumber: 8, totalDays: 21,
    reference: "John 11:25-26",
    verseLines: [
      "\"Jesus said to her, 'I am the resurrection and the life. The one who believes in me will live, even though they die; and whoever lives by believing in me will never die. Do you believe this?'\""
    ],
    simpleMeaning: "Jesus does not just offer resurrection in the future — He is the resurrection, present tense. Life in Him begins now.",
    context: "Jesus speaks this to Martha four days after her brother Lazarus died. She believed in a future resurrection — Jesus reframes it: He doesn't bring resurrection, He is it. Then He raises Lazarus from the tomb.",
    application: "Where in your life are you waiting for something to be resurrected — a relationship, a hope, a season? Bring it to the One who is resurrection.",
    reflection: "Martha got the theology right but missed the Person standing in front of her. Jesus asks the same question He asked her: 'Do you believe this?'",
    actionStep: "Answer His question honestly in your journal: 'Do I believe Jesus can bring life to what feels dead in me right now?'",
  },
  {
    id: "john-09", planId: "john21", dayNumber: 9, totalDays: 21,
    reference: "John 13:34-35",
    verseLines: [
      "\"A new command I give you: Love one another. As I have loved you, so you must love one another.\"",
      "\"By this everyone will know that you are my disciples, if you love one another.\""
    ],
    simpleMeaning: "The defining mark of a follower of Jesus is not doctrine, church attendance, or moral performance — it is love. Specifically, the kind of love Jesus modeled.",
    context: "Jesus gives this command at the Last Supper, after washing His disciples' feet and right before His arrest. It is both a farewell charge and the summary of everything He has demonstrated for three years.",
    application: "Think of the most difficult person in your life to love. Ask God for one concrete way to love them as Jesus would — not as you feel, but as He acted.",
    reflection: "He said 'as I have loved you' — that love went to the cross. The standard is not affection, it is sacrifice.",
    actionStep: "Do one unexpected act of service or encouragement for someone today without explanation or credit.",
  },
  {
    id: "john-10", planId: "john21", dayNumber: 10, totalDays: 21,
    reference: "John 14:1-3",
    verseLines: [
      "\"Do not let your hearts be troubled. You believe in God; believe also in me.\"",
      "\"My Father's house has many rooms; if that were not so, would I have told you that I am going there to prepare a place for you?\"",
      "\"And if I go and prepare a place for you, I will come back and take you to be with me that you also may be where I am.\""
    ],
    simpleMeaning: "Jesus speaks directly to anxiety. The cure for a troubled heart is not positive thinking — it is anchored trust in a Person who has gone ahead to prepare what comes next.",
    context: "Spoken in the Upper Room on the night of His arrest, to disciples who were frightened about His departure. Jesus reframes His leaving not as abandonment but as preparation.",
    application: "What is causing your heart to be troubled right now? Name it specifically, then place it consciously before the One who has already gone ahead of it.",
    reflection: "He did not say 'stop feeling troubled.' He said 'believe.' Belief and feeling can coexist.",
    actionStep: "Write down your top worry today. Then write: 'Jesus has already gone ahead of this.'",
  },
  {
    id: "john-11", planId: "john21", dayNumber: 11, totalDays: 21,
    reference: "John 14:6",
    verseLines: [
      "\"Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'\""
    ],
    simpleMeaning: "Jesus is not a method or a philosophy — He is the Way itself. Not a description of truth, but Truth. Not a guide to life, but Life.",
    context: "Thomas asked the honest question: 'We don't know where you are going, so how can we know the way?' Jesus does not give directions — He gives Himself.",
    application: "In a world of competing claims, bring one area of confusion or doubt to Jesus today and ask Him to be your truth in that space.",
    reflection: "The exclusivity of this verse is not arrogance — it is the specificity of a rescue operation. There is one antidote.",
    actionStep: "Memorize this verse today. Carry it as your compass.",
  },
  {
    id: "john-12", planId: "john21", dayNumber: 12, totalDays: 21,
    reference: "John 15:1-5",
    verseLines: [
      "\"I am the true vine, and my Father is the gardener. He cuts off every branch in me that bears no fruit, while every branch that does bear fruit he prunes so that it will be even more fruitful.\"",
      "\"Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me.\"",
      "\"I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.\""
    ],
    simpleMeaning: "Fruitfulness comes from connection, not effort. The branch does not strain to produce fruit — it simply stays attached to the vine.",
    context: "Spoken at the Last Supper, Jesus uses the image of vineyards familiar to every Jewish listener. Israel was often called God's vine in the Old Testament — here Jesus says He is the true vine that Israel was always meant to point to.",
    application: "Identify any aspects of life you are trying to handle in your own strength. Rest in the vine today — choose connection over striving.",
    reflection: "Pruning is not punishment. It is the Father's confidence that the branch can bear more.",
    actionStep: "Write down 3 areas of self-reliance. Declare: 'Apart from you I can do nothing — and in you, I can bear fruit.'",
  },
  {
    id: "john-13", planId: "john21", dayNumber: 13, totalDays: 21,
    reference: "John 15:13",
    verseLines: [
      "\"Greater love has no one than this: to lay down one's life for one's friends.\""
    ],
    simpleMeaning: "Love that costs nothing is not the deepest love. Jesus defines the ceiling of love — and then goes there.",
    context: "The evening before His crucifixion, Jesus defines the love He is about to demonstrate. He is not speaking theoretically. Within hours, He will embody this sentence completely.",
    application: "What would it look like to lay something down — time, comfort, preference, pride — for someone in your life today?",
    reflection: "He called them friends, not servants. He laid down His life for people He called by name.",
    actionStep: "Identify one sacrifice you can make for someone else today — however small. Do it without announcing it.",
  },
  {
    id: "john-14", planId: "john21", dayNumber: 14, totalDays: 21,
    reference: "John 16:33",
    verseLines: [
      "\"I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.\""
    ],
    simpleMeaning: "Jesus does not promise a trouble-free life. He promises something better: a peace that is not dependent on circumstances, grounded in His victory.",
    context: "Jesus speaks this at the end of His Upper Room discourse — a long farewell before His arrest. He summarizes everything: I've prepared you. Trouble is coming. But I have already won.",
    application: "Name the trouble you are currently facing. Then say aloud: 'He has overcome this.' Let that shift your posture, even slightly.",
    reflection: "Take heart — it is a command, not a feeling. You can take it because He has already won.",
    actionStep: "Write 'He has overcome' next to your biggest current challenge. Carry that declaration today.",
  },
  {
    id: "john-15", planId: "john21", dayNumber: 15, totalDays: 21,
    reference: "John 17:3",
    verseLines: [
      "\"Now this is eternal life: that they know you, the only true God, and Jesus Christ, whom you have sent.\""
    ],
    simpleMeaning: "Eternal life is not primarily a destination — it is a relationship. Knowing God is not the means to eternal life; it is eternal life itself.",
    context: "This is from Jesus' High Priestly Prayer — His intercession for His disciples and all future believers the night before He died. He prays that they would know the Father as He knows Him.",
    application: "Pursue knowing God today — not just knowing about Him. Read one passage slowly and ask: 'What does this show me about who You are?'",
    reflection: "The same intimacy Jesus has with the Father is what He prays for you to have.",
    actionStep: "Pray: 'God, I want to know You — not just know about You. Show me something of who You are today.'",
  },
  {
    id: "john-16", planId: "john21", dayNumber: 16, totalDays: 21,
    reference: "John 20:19-21",
    verseLines: [
      "\"On the evening of that first day of the week, when the disciples were together, with the doors locked for fear, Jesus came and stood among them and said, 'Peace be with you!'\"",
      "\"After he said this, he showed them his hands and side. The disciples were overjoyed when they saw the Lord. Again Jesus said, 'Peace be with you! As the Father has sent me, I am sending you.'\""
    ],
    simpleMeaning: "The risen Jesus does not come to locked rooms with accusation — He comes with peace. And in the same breath, He commissions them.",
    context: "Three days after the crucifixion, the disciples are in hiding, defeated and afraid. The risen Jesus appears, not to rebuke their cowardice, but to commission them. Peace comes before mission.",
    application: "If you feel disqualified by fear or failure, hear the same words: 'Peace be with you.' Then: 'I am sending you.' The two arrive together.",
    reflection: "He showed them the wounds. The scars are part of His authority — and they are part of yours.",
    actionStep: "Write down one way you feel unqualified. Then write: 'As the Father sent Jesus — so Jesus sends me.'",
  },
  {
    id: "john-17", planId: "john21", dayNumber: 17, totalDays: 21,
    reference: "John 20:27-28",
    verseLines: [
      "\"Then he said to Thomas, 'Put your finger here; see my hands. Reach out your hand and put it into my side. Stop doubting and believe.'\"",
      "\"Thomas said to him, 'My Lord and my God!'\""
    ],
    simpleMeaning: "Jesus meets honest doubt with patient evidence. Thomas's confession — 'My Lord and my God' — is the highest declaration of faith in the entire Gospel.",
    context: "Thomas missed the first appearance. He refused to believe without evidence. Jesus returns specifically for Thomas and meets him exactly where he is — offering the proof Thomas demanded. Jesus is not offended by doubt that is seeking.",
    application: "Are you in a season of doubt? Bring your questions directly to Jesus rather than away from Him. He can handle the most honest questions.",
    reflection: "Thomas demanded proof. Jesus gave it. Then Thomas gave the fullest confession. The path through doubt can lead to deeper faith.",
    actionStep: "Write down your most honest spiritual doubt right now. Bring it to Jesus as a prayer rather than keeping it silent.",
  },
  {
    id: "john-18", planId: "john21", dayNumber: 18, totalDays: 21,
    reference: "John 21:15-17",
    verseLines: [
      "\"When they had finished eating, Jesus said to Simon Peter, 'Simon son of John, do you love me more than these?' 'Yes, Lord,' he said, 'you know that I love you.' Jesus said, 'Feed my lambs.'\"",
      "\"Again Jesus said, 'Simon son of John, do you love me?' He answered, 'Yes, Lord, you know that I love you.' Jesus said, 'Take care of my sheep.'\"",
      "\"The third time he said to him, 'Simon son of John, do you love me?' Peter was hurt because Jesus asked him the third time, 'Do you love me?' He said, 'Lord, you know all things; you know that I love you.' Jesus said, 'Feed my sheep.'\""
    ],
    simpleMeaning: "Jesus restores Peter three times — one for each denial. He does not bring up the failure; He overwrites it with commission.",
    context: "Peter had denied Jesus three times around a charcoal fire. Now, around another charcoal fire on the beach, Jesus asks three times. The symmetry is deliberate. Full restoration, full re-commissioning.",
    application: "What failure or denial have you been carrying? Jesus doesn't erase it — He overwrites it with purpose. Hear your name called back into mission.",
    reflection: "The question 'Do you love me?' is the only qualification Jesus requires for the work.",
    actionStep: "Write a letter to Jesus answering the question: 'Do you love me?' honestly. Let it lead to a commitment.",
  },
  {
    id: "john-19", planId: "john21", dayNumber: 19, totalDays: 21,
    reference: "John 3:30",
    verseLines: [
      "\"He must become greater; I must become less.\""
    ],
    simpleMeaning: "John the Baptist summarizes the entire posture of discipleship in seven words. Greatness in God's kingdom is measured by how much room you make for Jesus.",
    context: "John the Baptist's disciples were concerned that everyone was now following Jesus instead. John responds with complete contentment — this is exactly what was supposed to happen.",
    application: "In what area of your life do you most need to decrease so Jesus can increase? Name it and make a concrete step.",
    reflection: "This is not self-hatred. It is the natural gravity of someone who has seen who Jesus is.",
    actionStep: "Identify one habit, ambition, or attitude that is about you increasing. Offer it in prayer as something to release.",
  },
  {
    id: "john-20", planId: "john21", dayNumber: 20, totalDays: 21,
    reference: "John 11:35",
    verseLines: [
      "\"Jesus wept.\""
    ],
    simpleMeaning: "The shortest verse in Scripture carries one of its most profound truths: God weeps with us. He is not distant from our grief.",
    context: "At the tomb of Lazarus, despite knowing He was about to raise him, Jesus wept. He entered the full weight of Mary and Martha's grief. He does not bypass human pain to get to the miracle.",
    application: "Bring your grief, loss, or sadness to Jesus today — not to have it fixed immediately, but to let Him weep with you in it.",
    reflection: "He who is about to raise the dead still stops to weep. That is the character of our God.",
    actionStep: "Sit with one grief or loss for 5 minutes today. Let Jesus be present in it with you before you pray for resolution.",
  },
  {
    id: "john-21", planId: "john21", dayNumber: 21, totalDays: 21,
    reference: "John 1:12-13",
    verseLines: [
      "\"Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God — children born not of natural descent, nor of human decision or a husband's will, but born of God.\""
    ],
    simpleMeaning: "Belonging to God's family is not earned by birth, behavior, or belonging to the right community. It is received — a gift given to those who believe.",
    context: "John closes his prologue with the widest invitation in Scripture: anyone. Not a particular race, status, or history. The only requirement is receiving Jesus.",
    application: "As you close this 21-day plan, receive again what you may have intellectually known: you are a child of God. Let that identity anchor everything else.",
    reflection: "You did not earn your way into God's family. You were born into it by His will.",
    actionStep: "Write down what it changes — practically today — to know you are a child of God.",
  },

  // ── 14 DAYS OF PSALMS ────────────────────────────────────────────────────
  {
    id: "psalm-01", planId: "psalms14", dayNumber: 1, totalDays: 14,
    reference: "Psalm 23:1-6",
    verseLines: [
      "\"The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.\"",
      "\"He guides me along the right paths for his name's sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.\"",
      "\"You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows. Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.\""
    ],
    simpleMeaning: "God is a hands-on shepherd — not a distant manager. He personally provides, guides, restores, and protects. The darkest valleys are not places of abandonment but of His closest presence.",
    context: "Attributed to David, who knew shepherd life personally before kingship. He writes from experience — both as one who cared for sheep and as one who had been led through valleys himself.",
    application: "Identify which part of this psalm you need most today — provision, guidance, restoration, or courage in a dark valley. Receive that specific promise.",
    reflection: "Goodness and love will follow you — not lead you back, but follow. They are behind you, catching what you miss.",
    actionStep: "Read this psalm slowly, aloud. Mark the phrase that catches your heart. Pray it back to God.",
  },
  {
    id: "psalm-02", planId: "psalms14", dayNumber: 2, totalDays: 14,
    reference: "Psalm 46:1-3, 10",
    verseLines: [
      "\"God is our refuge and strength, an ever-present help in trouble. Therefore we will not fear, though the earth give way and the mountains fall into the heart of the sea.\"",
      "\"'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.'\""
    ],
    simpleMeaning: "God does not ask you to be still because nothing is happening. He asks you to be still in the middle of chaos — because His identity does not shift when circumstances do.",
    context: "Likely written during a military threat to Jerusalem. The language of mountains falling into the sea is catastrophic — yet the response is stillness. This is not passive resignation; it is active trust anchored in who God is.",
    application: "What would it look like to practice one moment of deliberate stillness today — phone down, noise off, just present with God?",
    reflection: "Be still and know — the knowing comes from the stillness, not the other way around.",
    actionStep: "Set a 5-minute timer. No phone, no input. Just sit and breathe. Let God be God.",
  },
  {
    id: "psalm-03", planId: "psalms14", dayNumber: 3, totalDays: 14,
    reference: "Psalm 27:1, 4, 14",
    verseLines: [
      "\"The Lord is my light and my salvation — whom shall I fear? The Lord is the stronghold of my life — of whom shall I be afraid?\"",
      "\"One thing I ask from the Lord, this only do I seek: that I may dwell in the house of the Lord all the days of my life, to gaze on the beauty of the Lord and to seek him in his temple.\"",
      "\"Wait for the Lord; be strong and take heart and wait for the Lord.\""
    ],
    simpleMeaning: "David reduces his entire request to one thing: God's presence. Not safety, victory, or comfort — just nearness to God. That becomes the source of courage in every other circumstance.",
    context: "Attributed to David during a period of real threat. The Psalm moves between confidence and honest fear — a realistic portrait of faith that doesn't pretend to feel no fear.",
    application: "What is the 'one thing' you are truly seeking from God right now? Name it honestly, then compare it with David's one thing.",
    reflection: "Waiting is not passivity — it is the active posture of someone who trusts the timeline of a good God.",
    actionStep: "Write your answer to: 'What one thing am I really seeking from God in this season?'",
  },
  {
    id: "psalm-04", planId: "psalms14", dayNumber: 4, totalDays: 14,
    reference: "Psalm 51:1-4, 10",
    verseLines: [
      "\"Have mercy on me, O God, according to your unfailing love; according to your great compassion blot out my transgressions. Wash away all my iniquity and cleanse me from my sin.\"",
      "\"For I know my transgressions, and my sin is always before me. Against you, you only, have I sinned and done what is evil in your sight.\"",
      "\"Create in me a pure heart, O God, and renew a steadfast spirit within me.\""
    ],
    simpleMeaning: "True repentance is not feeling bad enough — it is turning toward God's mercy with honest acknowledgment of what has been broken. And God responds by creating something new.",
    context: "Written by David after being confronted by the prophet Nathan about his adultery with Bathsheba and the murder of Uriah. The most honest prayer of confession in Scripture.",
    application: "Is there something you've been carrying that needs confession? Use David's words as your own. Receive the mercy he received.",
    reflection: "He asks not just for forgiveness but for creation — 'create in me.' What needs to be created in you, not just cleared?",
    actionStep: "Write a Psalm 51 prayer in your own words — honest, specific, and ending with what you are asking God to create in you.",
  },
  {
    id: "psalm-05", planId: "psalms14", dayNumber: 5, totalDays: 14,
    reference: "Psalm 139:1-6, 13-14",
    verseLines: [
      "\"You have searched me, Lord, and you know me. You know when I sit and when I rise; you perceive my thoughts from afar. You discern my going out and my lying down; you are familiar with all my ways.\"",
      "\"Before a word is on my tongue you, Lord, know it completely. Such knowledge is too wonderful for me, too lofty for me to attain.\"",
      "\"For you created my inmost being; you knit me together in my mother's womb. I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.\""
    ],
    simpleMeaning: "You are known completely — every thought, every fear, every habit — and God's response to that full knowledge is not rejection but the intimacy of a craftsman who made you with care.",
    context: "David meditates on the inescapable knowledge of God. Rather than finding it threatening, he finds it comforting — to be fully known and not abandoned is the greatest security.",
    application: "What part of yourself do you most hide from God? Bring it today, knowing He already sees it and His response is craftsmanship, not condemnation.",
    reflection: "'Fearfully and wonderfully made' — the same awe you feel in the presence of something extraordinary, God felt when He made you.",
    actionStep: "Write down three things about yourself that you are tempted to despise. Practice saying 'fearfully and wonderfully made' over each one.",
  },
  {
    id: "psalm-06", planId: "psalms14", dayNumber: 6, totalDays: 14,
    reference: "Psalm 34:4-8",
    verseLines: [
      "\"I sought the Lord, and he answered me; he delivered me from all my fears.\"",
      "\"Those who look to him are radiant; their faces are never covered with shame.\"",
      "\"This poor man called, and the Lord heard him; he saved him out of all his troubles.\"",
      "\"Taste and see that the Lord is good; blessed is the one who takes refuge in him.\""
    ],
    simpleMeaning: "God responds to seekers. The Psalm is not abstract theology — it is personal testimony. David calls you to test this for yourself: taste and see.",
    context: "Written when David pretended to be insane to escape a dangerous king — a low, undignified moment. The testimony of God's goodness came out of a moment of desperation and absurdity.",
    application: "Where do you most need to take refuge today? Run there — not away from what is frightening, but into the arms of the One who is good.",
    reflection: "'Taste and see' is an invitation to experience, not just to believe. God is not asking you to assume He is good — He is inviting you to find out.",
    actionStep: "Recall one specific moment in your life when God was good to you. Write it down. Let it be evidence.",
  },
  {
    id: "psalm-07", planId: "psalms14", dayNumber: 7, totalDays: 14,
    reference: "Psalm 22:1-2, 24",
    verseLines: [
      "\"My God, my God, why have you forsaken me? Why are you so far from saving me, so far from my cries of anguish?\"",
      "\"My God, I cry out by day, but you do not answer, by night, but I find no rest.\"",
      "\"For he has not despised or scorned the suffering of the afflicted one; he has not hidden his face from him but has listened to his cry for help.\""
    ],
    simpleMeaning: "The Psalms give us permission to pray with complete honesty — including the feeling of God's absence. The remarkable turn in this Psalm is that the lament becomes trust.",
    context: "Jesus quoted the opening verse from the cross. David wrote from personal anguish, and centuries later his words became the cry of the Son of God. This is the most honest prayer of desolation in Scripture.",
    application: "If you are in a season where God feels absent, pray these words. You are not sinning by feeling forsaken — you are following the pattern of the Psalms and of Jesus Himself.",
    reflection: "The Psalm begins with abandonment and ends with testimony. The path through lament leads to praise, not around it.",
    actionStep: "Write a lament prayer. Name what feels absent, broken, or unanswered. Don't rush to resolution — sit in the honest middle of the Psalm.",
  },
  {
    id: "psalm-08", planId: "psalms14", dayNumber: 8, totalDays: 14,
    reference: "Psalm 1:1-3",
    verseLines: [
      "\"Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers,\"",
      "\"but whose delight is in the law of the Lord, and who meditates on his law day and night.\"",
      "\"That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither — whatever they do prospers.\""
    ],
    simpleMeaning: "The blessed life is not about what you avoid — it is about where you are rooted. A tree planted by water doesn't struggle to stay hydrated. It is sustained by its location.",
    context: "Psalm 1 is the gateway to the entire Psalter — a deliberate introduction that frames everything that follows. The contrast is sharp: tree planted by water vs. chaff blown by wind. Location determines vitality.",
    application: "Where are you planted? What are your regular inputs — what do you read, watch, and listen to most? Are they streams of water or desert ground?",
    reflection: "Delight is the word — not discipline, not duty. When you delight in God's word, the meditation happens naturally.",
    actionStep: "Identify one regular input in your life that is chaff rather than water. Make one small adjustment today.",
  },
  {
    id: "psalm-09", planId: "psalms14", dayNumber: 9, totalDays: 14,
    reference: "Psalm 103:1-5",
    verseLines: [
      "\"Praise the Lord, my soul; all my inmost being, praise his holy name. Praise the Lord, my soul, and forget not all his benefits —\"",
      "\"who forgives all your sins and heals all your diseases, who redeems your life from the pit and crowns you with love and compassion,\"",
      "\"who satisfies your desires with good things so that your youth is renewed like the eagle's.\""
    ],
    simpleMeaning: "Praise that begins with 'soul, forget not' suggests that we regularly do forget. The Psalm is a deliberate act of memory — calling to mind what God has done before asking for what comes next.",
    context: "A psalm of David — a song of lavish gratitude. The language is cumulative: forgives, heals, redeems, crowns, satisfies, renews. It builds into an overwhelming picture of a generous God.",
    application: "Before today's requests, spend time recounting what God has already done. Praise from memory changes the atmosphere of your prayer.",
    reflection: "He crowns you with love and compassion — not achievement, not perfection. The crown is grace.",
    actionStep: "List 5 specific things God has done for you. Begin your prayer time with these rather than with requests.",
  },
  {
    id: "psalm-10", planId: "psalms14", dayNumber: 10, totalDays: 14,
    reference: "Psalm 37:3-5",
    verseLines: [
      "\"Trust in the Lord and do good; dwell in the land and enjoy safe pasture.\"",
      "\"Take delight in the Lord, and he will give you the desires of your heart.\"",
      "\"Commit your way to the Lord; trust in him and he will do this.\""
    ],
    simpleMeaning: "The promise is not that God will fulfill every wish — it is that when you delight in Him, your desires become aligned with His. He gives what you truly want because He has shaped what you truly want.",
    context: "Psalm 37 is addressed to people anxious about the apparent prosperity of those who do evil. David's answer: stop staring at the wicked. Turn your energy toward trusting and committing to God.",
    application: "What are the deep desires of your heart in this season? Bring them honestly. Ask God whether they are from Him or from comparison with others.",
    reflection: "Delight in the Lord comes before the promise. You can't reverse the order.",
    actionStep: "Write down 3 deep desires of your heart. Ask: 'God, which of these are yours for me? Which are from fear or comparison?'",
  },
  {
    id: "psalm-11", planId: "psalms14", dayNumber: 11, totalDays: 14,
    reference: "Psalm 121:1-8",
    verseLines: [
      "\"I lift up my eyes to the mountains — where does my help come from? My help comes from the Lord, the Maker of heaven and earth.\"",
      "\"He will not let your foot slip — he who watches over you will not slumber; indeed, he who watches over Israel will neither slumber nor sleep.\"",
      "\"The Lord watches over you — the Lord is your shade at your right hand. The Lord will keep you from all harm — he will watch over your life; the Lord will watch over your coming and going both now and forevermore.\""
    ],
    simpleMeaning: "God is an attentive guardian — not a sleepy caretaker. The repetition of 'watches over' is intentional: He is actively, continuously present to your life.",
    context: "A song sung by pilgrims traveling up to Jerusalem for the festivals — often dangerous mountain roads. The question 'where does my help come from?' was not rhetorical; it was a genuine journey prayer.",
    application: "Where in your life do you feel unguarded, exposed, or unsafe? Let the watchfulness of God be your covering today.",
    reflection: "He watches your coming and going — the ordinary rhythms of life are under His constant care, not just the extraordinary moments.",
    actionStep: "As you move through today, practice awareness: 'God is watching over this moment.' Do it three times at different points in the day.",
  },
  {
    id: "psalm-12", planId: "psalms14", dayNumber: 12, totalDays: 14,
    reference: "Psalm 42:1-2, 5",
    verseLines: [
      "\"As the deer pants for streams of water, so my soul pants for you, my God. My soul thirsts for God, for the living God. When can I go and meet with God?\"",
      "\"Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.\""
    ],
    simpleMeaning: "Spiritual thirst is healthy — it points to what the soul is designed for. The Psalmist does not suppress the longing; he follows it toward God.",
    context: "The Sons of Korah wrote this likely during exile — separated from the Temple and from corporate worship. The ache of spiritual displacement is real. Yet they preach to their own souls: put your hope in God.",
    application: "Is your soul thirsty right now? Don't numb it or manage it — follow the thirst toward God. Let the longing bring you to His presence.",
    reflection: "'Why are you downcast, O my soul?' — talking to yourself honestly is sometimes the most spiritual thing you can do.",
    actionStep: "Speak to your own soul today. Write: 'Soul, why are you downcast? Put your hope in God because...' and finish the sentence.",
  },
  {
    id: "psalm-13", planId: "psalms14", dayNumber: 13, totalDays: 14,
    reference: "Psalm 91:1-2, 14-16",
    verseLines: [
      "\"Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the Lord, 'He is my refuge and my fortress, my God, in whom I trust.'\"",
      "\"'Because he loves me,' says the Lord, 'I will rescue him; I will protect him, for he acknowledges my name. He will call on me, and I will answer him; I will be with him in trouble, I will deliver him and honor him. With long life I will satisfy him and show him my salvation.'\""
    ],
    simpleMeaning: "The protection described is not automatic — it is for those who dwell, who say, who trust, who love, and who call. It is a relationship of mutual commitment.",
    context: "One of the most beloved psalms of protection. The promise is comprehensive: He covers, guards, rescues, answers, and walks through trouble with you. The condition is not perfection but dwelling — staying close.",
    application: "Are you dwelling in God's shelter today, or have you drifted to the edges? Return to the center — deliberately draw near today.",
    reflection: "'I will be with him in trouble' — not necessarily before or instead of it. God's promise is presence through, not always removal from.",
    actionStep: "Name one area of your life where you need God's shadow today. Ask specifically for His covering in that area.",
  },
  {
    id: "psalm-14", planId: "psalms14", dayNumber: 14, totalDays: 14,
    reference: "Psalm 150:1-6",
    verseLines: [
      "\"Praise the Lord. Praise God in his sanctuary; praise him in his mighty heavens. Praise him for his acts of power; praise him for his surpassing greatness.\"",
      "\"Praise him with the sounding of the trumpet, praise him with the harp and lyre, praise him with timbrel and dancing, praise him with the strings and pipe, praise him with the clash of cymbals.\"",
      "\"Let everything that has breath praise the Lord. Praise the Lord.\""
    ],
    simpleMeaning: "The entire Psalter — which begins with wisdom and passes through lament, confession, and trust — ends with full-throated, uninhibited praise. This is the destination of every honest prayer.",
    context: "Psalm 150 is the doxology at the end of the Psalms. Every instrument, every human, every breath — all of it pointed toward worship. The journey through all the hard Psalms arrives here.",
    application: "As you close this 14-day plan, offer praise with your whole self. Not because everything is resolved but because God is worthy regardless.",
    reflection: "Let everything that has breath — that includes whatever season you are in right now.",
    actionStep: "Write your own one-paragraph psalm of praise today. Include something God has shown you in the past 14 days.",
  },

  // ── 30-DAY DISCIPLESHIP PATH ─────────────────────────────────────────────
  {
    id: "disc-01", planId: "disciple30", dayNumber: 1, totalDays: 30,
    reference: "Matthew 4:19",
    verseLines: [
      "\"'Come, follow me,' Jesus said, 'and I will send you out to fish for people.'\""
    ],
    simpleMeaning: "The first invitation of Jesus is simple and personal: Come. Follow. He does not begin with a curriculum or a set of requirements — He begins with a relationship.",
    context: "Jesus calls fishermen — working men in the middle of their ordinary morning — with a two-word invitation: Follow me. No theological test, no credentials required. The qualification was willingness.",
    application: "Discipleship begins not with knowledge but with direction — turning toward Jesus. Is there any way you have turned your back on that invitation recently?",
    reflection: "He calls you in the middle of your ordinary life, not after you've cleaned it up.",
    actionStep: "Write a one-sentence answer: 'I am following Jesus by...' Make it specific to today.",
  },
  {
    id: "disc-02", planId: "disciple30", dayNumber: 2, totalDays: 30,
    reference: "Luke 9:23",
    verseLines: [
      "\"Then he said to them all: 'Whoever wants to be my disciple must deny themselves and take up their cross daily and follow me.'\""
    ],
    simpleMeaning: "Discipleship has a daily cost. The cross is not a decoration — it is a direction. Every day you pick it up again.",
    context: "Jesus says this to a crowd, not just to the Twelve. The call to discipleship is wide — but the conditions are honest. Denial of self, a cross, and following. Three daily acts.",
    application: "What does 'denying yourself' look like in the most ordinary decisions of your day today? Identify one specific moment.",
    reflection: "Daily is the word. Yesterday's cross-taking doesn't cover today.",
    actionStep: "Name the thing you most need to deny yourself today. Write it. Ask for grace to carry it.",
  },
  {
    id: "disc-03", planId: "disciple30", dayNumber: 3, totalDays: 30,
    reference: "John 8:31-32",
    verseLines: [
      "\"To the Jews who had believed him, Jesus said, 'If you hold to my teaching, you are really my disciples. Then you will know the truth, and the truth will set you free.'\""
    ],
    simpleMeaning: "Belief is the entry point but holding to the teaching is the ongoing life. Freedom comes not from knowing about truth but from living inside it.",
    context: "Jesus distinguishes between surface believers and real disciples. The difference is not sincerity but continuance — abiding in His word over time, not just in a moment of emotion.",
    application: "Where is there an area of your life where you know the truth intellectually but haven't let it fully set you free?",
    reflection: "The truth that sets free is not information — it is a Person, and the freedom is relationship with Him.",
    actionStep: "Identify one area of bondage — fear, habit, or pattern. Write: 'The truth about this is...' Then write: 'Jesus sets me free from this by...'",
  },
  {
    id: "disc-04", planId: "disciple30", dayNumber: 4, totalDays: 30,
    reference: "Matthew 5:3-6",
    verseLines: [
      "\"Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn, for they will be comforted.\"",
      "\"Blessed are the meek, for they will inherit the earth. Blessed are those who hunger and thirst for righteousness, for they will be filled.\""
    ],
    simpleMeaning: "Jesus inverts every cultural measure of success. The blessed are not the powerful, confident, or satisfied — they are the ones who know their own need.",
    context: "The opening of the Sermon on the Mount. These are not commands — they are descriptions. Jesus is describing the character of those who belong to God's kingdom, not prescribing how to earn it.",
    application: "Which beatitude speaks most directly to where you are today? Receive the blessing attached to your current condition.",
    reflection: "Poverty of spirit is not low self-esteem — it is accurate self-knowledge that leads to dependence on God.",
    actionStep: "Read all eight beatitudes. Circle the one that describes your current condition. Sit with the blessing Jesus attaches to it.",
  },
  {
    id: "disc-05", planId: "disciple30", dayNumber: 5, totalDays: 30,
    reference: "Matthew 5:13-14",
    verseLines: [
      "\"You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again? It is no longer good for anything, except to be thrown out and trampled underfoot.\"",
      "\"You are the light of the world. A town built on a hill cannot be hidden.\""
    ],
    simpleMeaning: "Salt preserves and seasons. Light reveals and guides. Jesus says you are both — not 'try to be' but 'you are.' The question is whether you are functioning as what you already are.",
    context: "Immediately after the beatitudes, Jesus describes the identity and function of His followers in the world. Identity comes before mission. You are, therefore you do.",
    application: "Where is your saltiness at risk of being diluted? Where is your light hidden under a bowl?",
    reflection: "You don't make yourself salt or light — Jesus declares it. Your work is not becoming these things but functioning as them.",
    actionStep: "Name one way you can be salt or light specifically in your context today — work, family, neighborhood.",
  },
  {
    id: "disc-06", planId: "disciple30", dayNumber: 6, totalDays: 30,
    reference: "Matthew 6:9-13",
    verseLines: [
      "\"Our Father in heaven, hallowed be your name, your kingdom come, your will be done, on earth as it is in heaven.\"",
      "\"Give us today our daily bread. And forgive us our debts, as we also have forgiven our debtors.\"",
      "\"And lead us not into temptation, but deliver us from the evil one.\""
    ],
    simpleMeaning: "Jesus gives His disciples a prayer that begins with God's agenda (hallowed name, kingdom, will) before moving to human needs (bread, forgiveness, protection). The order is the lesson.",
    context: "The disciples asked Jesus to teach them to pray. This is His answer — not a script to be recited but a pattern to be followed: worship, submission, provision, forgiveness, protection.",
    application: "Pray through this prayer slowly today, pausing at each phrase to make it personal and present.",
    reflection: "Daily bread implies daily asking. This prayer was not designed to be prayed once.",
    actionStep: "Use the Lord's Prayer as a framework today. Under each phrase, write one specific personal application.",
  },
  {
    id: "disc-07", planId: "disciple30", dayNumber: 7, totalDays: 30,
    reference: "Matthew 6:33",
    verseLines: [
      "\"But seek first his kingdom and his righteousness, and all these things will be given to you as well.\""
    ],
    simpleMeaning: "The order of priority is the teaching. Seek first. The 'all these things' — provision, security, stability — are added to kingdom-seekers, not chased by them.",
    context: "Jesus says this at the end of a long section on anxiety. He has pointed to birds and flowers to illustrate God's care. The conclusion: you cannot serve both God and money, so seek God first and let provision follow.",
    application: "What are you currently seeking first? Name it honestly. Is it security, approval, success? How does that reorder when God comes first?",
    reflection: "The promise is not that seeking first removes all needs — it is that God takes responsibility for those needs when you seek Him first.",
    actionStep: "Set your first 10 minutes today for prayer and Scripture before checking your phone, email, or news. That is seeking first.",
  },
  {
    id: "disc-08", planId: "disciple30", dayNumber: 8, totalDays: 30,
    reference: "Romans 12:1-2",
    verseLines: [
      "\"Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God — this is your true and proper worship.\"",
      "\"Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is — his good, pleasing and perfect will.\""
    ],
    simpleMeaning: "Transformation is not willpower — it is mind renewal. And the whole life offered to God is worship, not just Sunday singing.",
    context: "Paul has spent eleven chapters on theology. Now he turns to practice. The entire life — body, mind, patterns — offered to God is the logical response to His mercy.",
    application: "Offer your actual body and life to God today — not metaphorically but practically. What does a living sacrifice look like in how you use your time today?",
    reflection: "Living sacrifices have a tendency to crawl off the altar. This is why Paul says present yourself — present tense, ongoing.",
    actionStep: "Write a prayer of presentation: 'God, today I offer you my _____ as an act of worship.' Fill in specifics.",
  },
  {
    id: "disc-09", planId: "disciple30", dayNumber: 9, totalDays: 30,
    reference: "Galatians 5:22-23",
    verseLines: [
      "\"But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.\""
    ],
    simpleMeaning: "These qualities are fruit — they grow from an inner connection to the Spirit, not from external discipline alone. You cannot manufacture them; you cultivate the conditions for them.",
    context: "Paul contrasts the works of the flesh (striving, competing, destroying) with the fruit of the Spirit (one organic unit). Notice it is 'fruit' singular — all nine are one interconnected growth.",
    application: "Which of the nine are currently least visible in your life? That is where you need to cultivate connection to the Spirit most.",
    reflection: "A fruit tree doesn't force its fruit. It stays rooted, receives water and light, and fruit is the natural result. Your work is the rootedness.",
    actionStep: "Pick one fruit that feels absent today. Ask the Spirit specifically for it. Watch for it throughout the day.",
  },
  {
    id: "disc-10", planId: "disciple30", dayNumber: 10, totalDays: 30,
    reference: "James 1:22-25",
    verseLines: [
      "\"Do not merely listen to the word, and so deceive yourselves. Do what it says.\"",
      "\"Anyone who listens to the word but does not do what it says is like someone who looks at his face in a mirror and, after looking at himself, goes away and immediately forgets what he looks like.\""
    ],
    simpleMeaning: "The word is a mirror, not a performance. But a mirror is only useful if you act on what you see. Spiritual knowledge without obedience is self-deception.",
    context: "James is writing to Jewish Christians scattered by persecution. He is intensely practical: pure religion is not theological precision but active obedience — caring for the vulnerable and keeping yourself unstained.",
    application: "What has God shown you in Scripture recently that you haven't acted on? Name it. Take one step toward doing it today.",
    reflection: "The person who forgets what he looks like has seen himself — they just didn't let the seeing change anything.",
    actionStep: "Identify one thing from recent Scripture reading you have heard but not done. Write one concrete action step.",
  },
  {
    id: "disc-11", planId: "disciple30", dayNumber: 11, totalDays: 30,
    reference: "Hebrews 10:24-25",
    verseLines: [
      "\"And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another — and all the more as you see the Day approaching.\""
    ],
    simpleMeaning: "Community is not optional for discipleship — it is structural. You cannot fully obey this verse alone. It requires others.",
    context: "Written to Jewish Christians tempted to withdraw from the community of faith due to persecution. The writer urges perseverance in gathering — noting that some had already made isolation a habit.",
    application: "Who are you spurring on? Who is spurring you? If you can't name them, you may have drifted from the community the Bible assumes you're embedded in.",
    reflection: "Consider how — it implies intentionality. You have to think about how to encourage someone, not just assume proximity does it.",
    actionStep: "Send a specific, personal word of encouragement to one person in your community today. Not general — something specific you've noticed in them.",
  },
  {
    id: "disc-12", planId: "disciple30", dayNumber: 12, totalDays: 30,
    reference: "1 Peter 2:9",
    verseLines: [
      "\"But you are a chosen people, a royal priesthood, a holy nation, God's special possession, that you may declare the praises of him who called you out of darkness into his wonderful light.\""
    ],
    simpleMeaning: "Your identity is fourfold: chosen, royal, holy, possessed — and all of it is given, not earned. The purpose of that identity is declaring what God has done.",
    context: "Peter writes to scattered and suffering Christians, reminding them of who they are when their circumstances say otherwise. The identity list is drawn from Exodus 19 — Israel's covenant identity — now applied to the church.",
    application: "Which of these four identity statements do you most need to receive today? Sit with it: chosen, royal, holy, possessed.",
    reflection: "Called out of darkness into light — the gospel in five words. You are somewhere different than you were.",
    actionStep: "Write down all four identity markers. Under each one, write one way it practically changes how you see yourself or how you live.",
  },
  {
    id: "disc-13", planId: "disciple30", dayNumber: 13, totalDays: 30,
    reference: "Matthew 28:18-20",
    verseLines: [
      "\"Then Jesus came to them and said, 'All authority in heaven and on earth has been given to me. Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,\"",
      "\"and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.'\""
    ],
    simpleMeaning: "The Great Commission is not a suggestion for the especially bold — it is the shared mission of every disciple. And it is backed by all authority and accompanied by constant presence.",
    context: "The last words of Jesus in Matthew's Gospel. 'All authority' is the grounds for going. 'I am with you always' is the sustaining presence. The mission is sandwiched between power and presence.",
    application: "Who in your daily sphere of influence could you make a disciple of? You don't have to cross an ocean — discipleship can start with the person next to you.",
    reflection: "Go is in the middle — the authority and the presence wrap around it. The commission is not about your capability but His.",
    actionStep: "Write the name of one person you could intentionally disciple or invest in spiritually. What is one first step?",
  },
  {
    id: "disc-14", planId: "disciple30", dayNumber: 14, totalDays: 30,
    reference: "Philippians 4:6-7",
    verseLines: [
      "\"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.\"",
      "\"And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.\""
    ],
    simpleMeaning: "The antidote to anxiety is not discipline or positivity — it is prayer with thanksgiving. The peace that results is not something you manufacture; it is something that guards you.",
    context: "Written from prison, by a man who had every earthly reason for anxiety. Paul is not writing theory. He has tested this and found it true in circumstances far harder than most.",
    application: "What are you most anxious about today? Present it to God — specifically, not generally — with gratitude for what He has already done.",
    reflection: "The peace transcends understanding — it doesn't make sense in proportion to your circumstances. That is the point.",
    actionStep: "Write your anxiety on paper. Then write three things you are thankful for in the same situation. Present both to God.",
  },
  {
    id: "disc-15", planId: "disciple30", dayNumber: 15, totalDays: 30,
    reference: "Colossians 3:16",
    verseLines: [
      "\"Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom through psalms, hymns, and songs from the Spirit, singing to God with gratitude in your hearts.\""
    ],
    simpleMeaning: "The word of Christ should not just visit — it should dwell richly. Richness implies depth and abundance, not a surface familiarity.",
    context: "Paul describes a community shaped by the word — where Scripture saturates conversation, correction, and worship. The corporate and personal are intertwined: the word in you produces worship among you.",
    application: "Is the word of Christ dwelling in you richly, or sparsely? What is the quality of your engagement with Scripture beyond this daily reading?",
    reflection: "Dwell richly means the word has moved into your home and arranged the furniture.",
    actionStep: "Memorize one verse this week — commit to carrying it with you. Let it dwell in you beyond the morning devotional.",
  },
  {
    id: "disc-16", planId: "disciple30", dayNumber: 16, totalDays: 30,
    reference: "2 Timothy 3:16-17",
    verseLines: [
      "\"All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work.\""
    ],
    simpleMeaning: "Scripture is not a collection of inspiring stories — it is breathed out by God for specific purposes: teaching, rebuking, correcting, and training. It equips, not just comforts.",
    context: "Paul writes to Timothy, his young protégé, in the final letter of his life. He urges Timothy to hold to Scripture in a world of false teaching, knowing that the word has the authority to do what human persuasion cannot.",
    application: "When did Scripture last rebuke or correct you — not comfort you? If it has only been a source of comfort recently, ask God to let it do its full work.",
    reflection: "God-breathed — the same word used for God breathing life into Adam. Scripture carries that creative, life-giving authority.",
    actionStep: "Read a passage that challenges you today, not just one that comforts. Ask God to train you through it.",
  },
  {
    id: "disc-17", planId: "disciple30", dayNumber: 17, totalDays: 30,
    reference: "Luke 10:27",
    verseLines: [
      "\"'Love the Lord your God with all your heart and with all your soul and with all your strength and with all your mind'; and, 'Love your neighbor as yourself.'\""
    ],
    simpleMeaning: "Everything in the law hangs on two loves — one vertical, one horizontal. They are inseparable. You cannot genuinely have one without the other.",
    context: "A lawyer asks Jesus which commandment is greatest. Jesus quotes the Shema (Deuteronomy 6) and Leviticus 19:18. The entire law, Jesus says, summarizes in love.",
    application: "Which is weaker right now — your love for God or your love for neighbor? Where do you need to invest today?",
    reflection: "'As yourself' — loving yourself rightly is part of the command. You cannot give what you have not received.",
    actionStep: "Do one specific act of love for God (prayer, worship, surrender) and one for a neighbor today. Name both before you start.",
  },
  {
    id: "disc-18", planId: "disciple30", dayNumber: 18, totalDays: 30,
    reference: "Matthew 11:28-30",
    verseLines: [
      "\"Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.\"",
      "\"For my yoke is easy and my burden is light.\""
    ],
    simpleMeaning: "Jesus does not call the strong — He calls the weary. Rest is not the absence of a yoke; it is being yoked to the right person who carries the weight.",
    context: "A yoke was a farming tool that linked two animals together. Jesus offers to be yoked with you — meaning you are not carrying alone. His pace, His direction, His strength alongside yours.",
    application: "What weight are you carrying today that was never meant for you alone? Lay it down and pick up His yoke — the difference is who you're walking beside.",
    reflection: "He is gentle and humble — the One you are yoked to is not demanding or harsh. You can trust His pace.",
    actionStep: "Name the burden you are carrying. Say aloud: 'I trade this weight for your yoke.' Let that shift your posture today.",
  },
  {
    id: "disc-19", planId: "disciple30", dayNumber: 19, totalDays: 30,
    reference: "Ephesians 6:10-12",
    verseLines: [
      "\"Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil's schemes.\"",
      "\"For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms.\""
    ],
    simpleMeaning: "Discipleship includes spiritual warfare. The most important battles are not visible. The strength you need comes from the Lord, not from self-improvement.",
    context: "Paul ends his most theological letter with a call to arms — not physical but spiritual. The enemy is real and strategic. The armor is not metaphorical decoration; it is practical preparation.",
    application: "Where are you in a battle right now that you've been treating as if it's only a human conflict? Engage it with prayer and spiritual discernment today.",
    reflection: "Stand firm — not charge forward alone. The armor is for holding ground already taken, not conquering in your own strength.",
    actionStep: "Pray through the full armor of God today (Ephesians 6:13-18). Name what you are putting on and what battle you are preparing for.",
  },
  {
    id: "disc-20", planId: "disciple30", dayNumber: 20, totalDays: 30,
    reference: "Acts 2:42-45",
    verseLines: [
      "\"They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.\"",
      "\"Everyone was filled with awe at the many wonders and signs performed by the apostles. All the believers were together and had everything in common. They sold property and possessions to give to anyone who had need.\""
    ],
    simpleMeaning: "The first church had four rhythms: teaching, fellowship, communion, prayer. These were not programs — they were devotions. And the result was awe and generosity.",
    context: "Three thousand people were added to the church on Pentecost. This is what they did with that growth — not build bigger buildings but deepen the four rhythms together.",
    application: "Which of the four rhythms (teaching, fellowship, communion, prayer) is weakest in your current spiritual life? What would it take to strengthen it?",
    reflection: "They devoted themselves — not attended occasionally. The word implies wholehearted, sustained commitment.",
    actionStep: "Pick one of the four and commit to a specific increase this week: more time in teaching, more intentional fellowship, more frequent communion, or more consistent prayer.",
  },
  {
    id: "disc-21", planId: "disciple30", dayNumber: 21, totalDays: 30,
    reference: "1 Corinthians 13:1-3",
    verseLines: [
      "\"If I speak in the tongues of men or of angels, but do not have love, I am only a resounding gong or a clanging cymbal.\"",
      "\"If I have the gift of prophecy and can fathom all mysteries and all knowledge, and if I have a faith that can move mountains, but do not have love, I am nothing.\"",
      "\"If I give all I possess to the poor and give over my body to hardship that I may boast, but do not have love, I gain nothing.\""
    ],
    simpleMeaning: "Every spiritual gift, every sacrifice, every act of faith — without love at the center, it produces nothing of eternal value. Love is not one virtue among many; it is the substance.",
    context: "The Corinthian church was gifted but fractured. Paul writes the love chapter not as a wedding reading but as a rebuke — you have everything except the most important thing.",
    application: "Examine your current spiritual activity: serving, giving, studying, leading. Is love the motivation or is it reputation, duty, or guilt?",
    reflection: "I am nothing — not 'worth less' but nothing. The subtract-love equation equals zero every time.",
    actionStep: "Do one act today motivated purely by love with no expectation of recognition. Notice how it feels compared to obligation.",
  },
  {
    id: "disc-22", planId: "disciple30", dayNumber: 22, totalDays: 30,
    reference: "Proverbs 3:5-6",
    verseLines: [
      "\"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.\""
    ],
    simpleMeaning: "The instruction has two moves: trust fully and lean away from self. The promise has one: He makes the path straight. You navigate by trust, not by full visibility.",
    context: "Proverbs 3 presents wisdom as relational, not mechanical. Trusting God is the beginning of wisdom — not intelligence or strategy.",
    application: "Where are you currently leaning on your own understanding — trying to figure something out rather than trust God with it?",
    reflection: "All your ways — not just the big decisions. Submitting your ordinary day to Him is as important as submitting your major choices.",
    actionStep: "Name one decision or worry you have been trying to solve alone. Place it in God's hands in prayer — specifically, not generally.",
  },
  {
    id: "disc-23", planId: "disciple30", dayNumber: 23, totalDays: 30,
    reference: "Isaiah 40:31",
    verseLines: [
      "\"But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.\""
    ],
    simpleMeaning: "The promise is renewal — not an absence of weariness, but the replenishment of strength for those who wait on God. The eagle soars not by flapping harder but by catching the current.",
    context: "Isaiah speaks to exiles in Babylon who had been waiting for decades. The promise is not that waiting is easy — it is that those who wait on God receive something those who don't wait never experience.",
    application: "Where are you weary today — in body, soul, or hope? Choose to wait on God for renewal rather than pushing through in your own strength.",
    reflection: "Soar, run, and walk — three speeds of life. The promise covers all of them: supernatural moments, sustained effort, and ordinary daily plodding.",
    actionStep: "Sit in silence for 5 minutes and simply wait on God. No agenda. Let renewal come in whatever form He chooses.",
  },
  {
    id: "disc-24", planId: "disciple30", dayNumber: 24, totalDays: 30,
    reference: "Mark 1:35",
    verseLines: [
      "\"Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.\""
    ],
    simpleMeaning: "Jesus — fully God — still needed to pray. The Son of God did not outsource His communion with the Father. If He needed it, so do you.",
    context: "The day before this verse, Jesus had healed many people, cast out demons, and preached. It was an exhausting day of ministry. His response to a full day was an early morning of prayer before the next one began.",
    application: "What is your pattern for prayer? Not the idea of it — the practice. When, where, and how do you actually pray?",
    reflection: "While it was still dark — the discipline preceded the daylight. Prayer was not what Jesus did when He had time; it was what made the rest of the day possible.",
    actionStep: "Set your alarm 15 minutes earlier tomorrow for prayer. Use this plan as your anchor — show up before the demands of the day do.",
  },
  {
    id: "disc-25", planId: "disciple30", dayNumber: 25, totalDays: 30,
    reference: "Luke 6:46-48",
    verseLines: [
      "\"'Why do you call me, Lord, Lord, and do not do what I say?'\"",
      "\"As for everyone who comes to me and hears my words and puts them into practice, I will show you what they are like. They are like a man building a house, who dug down deep and laid the foundation on rock. When a flood came, the torrent struck that house but could not shake it, because it was well built.\""
    ],
    simpleMeaning: "The stability of your life is not determined by the absence of storms but by the depth of your foundation. Hearing without doing produces a beautiful house on sand.",
    context: "Jesus closes the Sermon on the Plain with this parable. The contrast is not between a good person and a bad person — it is between two people who both heard the teaching. One obeyed; one didn't.",
    application: "What is one teaching of Jesus you have heard repeatedly but not built into the structure of your daily life? Today, lay one stone of obedience.",
    reflection: "He dug down deep — foundation work is invisible. No one compliments the footings. But everything depends on them.",
    actionStep: "Name one area of obedience you have been avoiding. Write: 'Today I will lay one foundation stone by...'",
  },
  {
    id: "disc-26", planId: "disciple30", dayNumber: 26, totalDays: 30,
    reference: "2 Corinthians 12:9-10",
    verseLines: [
      "\"But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me.\"",
      "\"That is why, for Christ's sake, I delight in weaknesses, in insults, in hardships, in persecutions, in difficulties. For when I am weak, then I am strong.\""
    ],
    simpleMeaning: "Weakness is not the enemy of spiritual life — it is the location where God's power is most visible. The disciple's relationship with weakness is transformed: from shame to sufficiency.",
    context: "Paul asked God to remove a 'thorn in the flesh' three times. God refused. The answer was grace — sufficient, not removed. Paul's response is to boast in weakness, having learned what weakness unlocks.",
    application: "What weakness, limitation, or struggle have you been asking God to remove? What if its purpose is to display His sufficiency?",
    reflection: "Power made perfect in weakness — the math only works one way. You cannot prove sufficiency in strength.",
    actionStep: "Name your current weakness. Write: 'God's grace is sufficient for this because...' Let the promise be specific.",
  },
  {
    id: "disc-27", planId: "disciple30", dayNumber: 27, totalDays: 30,
    reference: "Matthew 25:35-40",
    verseLines: [
      "\"'For I was hungry and you gave me something to eat, I was thirsty and you gave me something to drink, I was a stranger and you invited me in, I needed clothes and you clothed me, I was sick and you looked after me, I was in prison and you came to visit me.'\"",
      "\"Then the righteous will answer him, 'Lord, when did we see you hungry and feed you, or thirsty and give you something to drink?'\"",
      "\"The King will reply, 'Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me.'\""
    ],
    simpleMeaning: "Jesus identifies Himself with the vulnerable and the invisible. Service to the least is service to Him. And the righteous here served without knowing they were serving Jesus — they just served.",
    context: "The parable of the sheep and goats — Jesus describes the final judgment. The criteria is not theological knowledge or religious practice — it is whether the hungry were fed, the stranger welcomed, the sick visited.",
    application: "Who are the 'least of these' in your immediate sphere today — overlooked, struggling, invisible? How can you serve Jesus by serving them?",
    reflection: "They asked 'when did we see you?' — they were not performing for an audience. Genuine service doesn't need to be recognized.",
    actionStep: "Identify one person in your life who is 'the least of these' in some way. Do one specific act of service for them today.",
  },
  {
    id: "disc-28", planId: "disciple30", dayNumber: 28, totalDays: 30,
    reference: "Romans 8:28",
    verseLines: [
      "\"And we know that in all things God works for the good of those who love him, who have been called according to his purpose.\""
    ],
    simpleMeaning: "The promise is not that everything is good — it is that God works everything toward good for those who love Him. The difference matters enormously.",
    context: "Paul writes this in the middle of a discussion about suffering, hope, and the Spirit's intercession. It is not naive optimism — it is confident trust in the sovereignty of a God who redeems.",
    application: "What situation in your life right now feels unredeemable? Can you hold both the reality of its difficulty and the promise that God is working in it?",
    reflection: "'All things' — Paul does not exclude the painful ones. The promise covers the full range.",
    actionStep: "Name one difficult thing in your life. Write: 'God is working this for good by...' Then leave space and watch.",
  },
  {
    id: "disc-29", planId: "disciple30", dayNumber: 29, totalDays: 30,
    reference: "1 John 1:9",
    verseLines: [
      "\"If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.\""
    ],
    simpleMeaning: "Confession is the practice that keeps the relationship clean. It is not groveling or self-punishment — it is agreeing with God about what is true, and receiving the forgiveness He has already made available.",
    context: "John writes to Christians who thought they had no sin — a form of spiritual self-deception he calls walking in darkness. Confession is the practice of walking in light.",
    application: "Is there anything between you and God right now — something unconfessed, avoided, or minimized? Name it. Receive His faithfulness.",
    reflection: "He is faithful and just — forgiveness is not God being lenient. It is God being consistent with His character and the work of Christ.",
    actionStep: "Spend time in honest confession today. Not a list of crimes — a conversation with a Father who already knows and is already faithful.",
  },
  {
    id: "disc-30", planId: "disciple30", dayNumber: 30, totalDays: 30,
    reference: "Philippians 1:6",
    verseLines: [
      "\"Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.\""
    ],
    simpleMeaning: "God finishes what He starts. You are not a project He abandoned halfway through. The same faithfulness that began the work in you guarantees its completion.",
    context: "Paul writes to his most beloved church from prison, full of joy. He is confident not in their performance but in God's faithfulness to complete what He began at their conversion.",
    application: "As you close this 30-day journey, receive this confidence: God is not done with you. The work He started in you the day you turned to Him is still in progress, and He will see it through.",
    reflection: "He began it — you didn't. He carries it — you cooperate. He completes it — you trust.",
    actionStep: "Write a brief letter to yourself: 'What God has started in me through these 30 days is...' Seal it and return to it in 3 months.",
  },
];

// Default verses shown in the Bible tab (first verse of each plan)
export const DEFAULT_VERSES: ScriptureVerse[] = [
  ALL_VERSES.find((v) => v.id === "john-01")!,
  ALL_VERSES.find((v) => v.id === "psalm-01")!,
  ALL_VERSES.find((v) => v.id === "disc-01")!,
];

export const DEFAULT_PRAYERS: Prayer[] = [
  {
    id: "p1",
    text: "Lord, grant me the wisdom to navigate the challenges at work today. Help me to speak with grace and act with integrity even when under pressure.",
    timestamp: "TODAY, 8:42 AM",
    categoryTags: ["WORK", "WISDOM"],
    answered: false
  },
  {
    id: "p2",
    text: "Seeking healing for Sarah's surgery. Praying for the surgeon's hands and for a peace that surpasses all understanding for the family.",
    timestamp: "AUG 24, 2023",
    categoryTags: ["HEALTH", "FAMILY"],
    answered: true,
    answerText: "Surgery was a success! Doctors are amazed at the recovery speed. Praise be to God."
  },
  {
    id: "p3",
    text: "Guidance for the new mission season. Open the doors that should be opened and close those that are not from You.",
    timestamp: "AUG 20, 2023",
    categoryTags: ["GUIDANCE", "FAITH"],
    answered: false
  }
];

export const DEFAULT_MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Forgive someone",
    description: "Release a debt or a grudge that you've been holding. Take the first step toward reconciliation today.",
    iconType: "Heart",
    status: "idle"
  },
  {
    id: "m2",
    title: "Pray for someone",
    description: "Identify someone in your circle who is struggling and commit to five minutes of focused intercession.",
    iconType: "BookOpen",
    status: "idle"
  },
  {
    id: "m3",
    title: "Share faith",
    description: "Have a meaningful conversation about your spiritual journey with a friend or colleague this week.",
    iconType: "MessageCircle",
    status: "idle"
  },
  {
    id: "m4",
    title: "Serve locally",
    description: "Find a local food bank, shelter, or community garden and sign up for a volunteer shift.",
    iconType: "Users",
    status: "idle"
  }
];

export const DEFAULT_STAGES: PathStage[] = [
  {
    id: "s1",
    name: "Seeker",
    description: "Discovering who God is and asking the fundamental questions of faith.",
    completedDate: "Jan 2024",
    completed: true,
    active: false
  },
  {
    id: "s2",
    name: "Believer",
    description: "Placing active trust in Jesus Christ and acknowledging Him as Savior.",
    completedDate: "March 2024",
    completed: true,
    active: false
  },
  {
    id: "s3",
    name: "Disciple",
    description: "Developing consistent personal disciplines of prayer, study, community life, and obedience.",
    completed: false,
    active: true,
    progressPercent: 64,
    subtracks: [
      {
        id: "sub1",
        label: "Deep Study",
        subtitle: "4/7 days completed",
        icon: "BookOpen"
      },
      {
        id: "sub2",
        label: "Koinonia",
        subtitle: "Weekly group session",
        icon: "Users"
      },
      {
        id: "sub3",
        label: "Reflection",
        subtitle: "Daily journal entry",
        icon: "Edit3"
      }
    ],
    requirements: [
      {
        id: "r1",
        text: "Complete 'The Great Commission' module",
        completed: true
      },
      {
        id: "r2",
        text: "Guide 2 individuals through Seeker path",
        completed: false
      },
      {
        id: "r3",
        text: "Attend Leadership Workshop",
        completed: false
      }
    ]
  },
  {
    id: "s4",
    name: "Ambassador",
    description: "Leading others towards the truth, showing exemplary character, and discipling searchers.",
    completed: false,
    active: false
  }
];

export const CURRICULUM_PLANS: CurriculumPlan[] = [
  {
    id: "growing_in_christ",
    title: "Growing in Christ",
    topics: [
      {
        id: "making_disciples",
        title: "Making Disciples",
        lessons: [
          { id: "md_1", title: "Called to Multiply", goal: "Discipleship is multiplication", scripture: "Matthew 28:19", practice: "Share faith or encouragement with 1 person", verseId: "disc-13" },
          { id: "md_2", title: "Training Others", goal: "Disciples grow by teaching", scripture: "2 Timothy 2:2", practice: "Explain one Bible truth to someone", verseId: "curr-tm-2" },
          { id: "md_3", title: "Lifestyle Witness", goal: "Live as Christ example", scripture: "Matthew 5:16", practice: "Do one act of kindness", verseId: "curr-mt-5-16" }
        ]
      },
      {
        id: "being_a_disciple",
        title: "Being a Disciple",
        lessons: [
          { id: "bd_1", title: "Follow Daily", goal: "Daily surrender", scripture: "Luke 9:23", practice: "Surrender one decision today", verseId: "disc-04" },
          { id: "bd_2", title: "Abide in Christ", goal: "Stay connected", scripture: "John 15:5", practice: "10 min silence with God", verseId: "curr-jn-15-5" },
          { id: "bd_3", title: "Obedience First", goal: "Act on conviction", scripture: "James 1:22", practice: "Obey one prompt immediately", verseId: "disc-10" }
        ]
      },
      {
        id: "quiet_time",
        title: "Quiet Time",
        lessons: [
          { id: "qt_1", title: "Stillness with God", goal: "Build presence", scripture: "Psalm 46:10", practice: "5 min silence", verseId: "curr-ps-46" },
          { id: "qt_2", title: "Listen First", goal: "Hear God", scripture: "1 Samuel 3:10", practice: "Write 1 insight", verseId: "curr-1sam-3" },
          { id: "qt_3", title: "Daily Rhythm", goal: "Consistency", scripture: "Mark 1:35", practice: "Set fixed prayer time", verseId: "disc-24" }
        ]
      }
    ]
  },
  {
    id: "message_of_christ",
    title: "Understanding the Message of Christ",
    topics: [
      {
        id: "trinity",
        title: "3 Persons in 1",
        lessons: [
          { id: "tri_1", title: "One God", goal: "God is one", scripture: "Deuteronomy 6:4", practice: "Reflect on unity", verseId: "curr-dt-6-4" },
          { id: "tri_2", title: "Father Son Spirit", goal: "Understand roles", scripture: "Matthew 28:19", practice: "Write roles", verseId: "disc-13" },
          { id: "tri_3", title: "Mystery of Faith", goal: "Accept mystery", scripture: "John 1:1", practice: "Reflect quietly", verseId: "john-01" }
        ]
      },
      {
        id: "sin",
        title: "Sin",
        lessons: [
          { id: "sin_1", title: "Separation", goal: "Understand sin", scripture: "Romans 3:23", practice: "Identify struggle", verseId: "curr-rom-3-23" },
          { id: "sin_2", title: "Brokenness", goal: "Human condition", scripture: "Romans 6:23", practice: "Reflect consequences", verseId: "curr-rom-6-23" },
          { id: "sin_3", title: "Need for Savior", goal: "Need Jesus", scripture: "Mark 2:17", practice: "Pray forgiveness", verseId: "curr-mk-2-17" }
        ]
      },
      {
        id: "grace",
        title: "Grace",
        lessons: [
          { id: "gr_1", title: "Undeserved Favor", goal: "Grace is gift", scripture: "Ephesians 2:8", practice: "Receive grace", verseId: "curr-eph-2-8" },
          { id: "gr_2", title: "Not Earned", goal: "Not works", scripture: "Titus 3:5", practice: "Release performance", verseId: "curr-tit-3-5" },
          { id: "gr_3", title: "Restoration", goal: "God restores", scripture: "2 Corinthians 12:9", practice: "Accept weakness", verseId: "disc-26" }
        ]
      }
    ]
  },
  {
    id: "becoming_like_christ",
    title: "Becoming Like Christ",
    topics: [
      {
        id: "holy_spirit",
        title: "Holy Spirit",
        lessons: [
          { id: "hs_1", title: "Indwelling Spirit", goal: "Spirit in you", scripture: "Acts 1:8", practice: "Invite Spirit", verseId: "curr-acts-1-8" },
          { id: "hs_2", title: "Guidance", goal: "Spirit leads", scripture: "John 16:13", practice: "Ask direction", verseId: "curr-jn-16-13" },
          { id: "hs_3", title: "Power", goal: "Spiritual strength", scripture: "Acts 2:4", practice: "Act in faith", verseId: "curr-acts-2-4" }
        ]
      },
      {
        id: "fruit_spirit",
        title: "Fruit of the Spirit",
        lessons: [
          { id: "fs_1", title: "Love First", goal: "Character growth", scripture: "Galatians 5:22", practice: "Show love", verseId: "disc-09" },
          { id: "fs_2", title: "Trust", goal: "Faith over fear", scripture: "Proverbs 3:5", practice: "Release worry", verseId: "disc-22" },
          { id: "fs_3", title: "Self Control", goal: "Discipline", scripture: "Galatians 5:23", practice: "Resist impulse", verseId: "curr-gal-5-23" }
        ]
      }
    ]
  },
  {
    id: "serving_christ",
    title: "Serving Christ",
    topics: [
      {
        id: "church",
        title: "The Church",
        lessons: [
          { id: "ch_1", title: "Body of Christ", goal: "Community", scripture: "1 Corinthians 12:27", practice: "Engage church", verseId: "curr-1cor-12-27" },
          { id: "ch_2", title: "Unity", goal: "Togetherness", scripture: "Ephesians 4:3", practice: "Encourage someone", verseId: "curr-eph-4-3" },
          { id: "ch_3", title: "Service", goal: "Serve others", scripture: "Galatians 5:13", practice: "Help someone", verseId: "curr-gal-5-13" }
        ]
      },
      {
        id: "spiritual_warfare",
        title: "Spiritual Warfare",
        lessons: [
          { id: "sw_1", title: "Spiritual Battle", goal: "Awareness", scripture: "Ephesians 6:12", practice: "Pray protection", verseId: "disc-19" },
          { id: "sw_2", title: "Armor of God", goal: "Defense", scripture: "Ephesians 6:11", practice: "Reflect armor", verseId: "curr-eph-6-11" },
          { id: "sw_3", title: "Stand Firm", goal: "Resist temptation", scripture: "James 4:7", practice: "Reject temptation", verseId: "curr-jas-4-7" }
        ]
      }
    ]
  }
];

export const CURRICULUM_VERSES: ScriptureVerse[] = [
  {
    id: "curr-tm-2", planId: "curriculum", dayNumber: 1, totalDays: 20,
    reference: "2 Timothy 2:2",
    verseLines: ["\"And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.\""],
    simpleMeaning: "Discipleship is a chain — you were taught by someone, and you teach others. Faith multiplies when it is passed on intentionally.",
    context: "Paul writes this from prison to Timothy, his young protege. He knows his own time is short and urges Timothy to reproduce himself in others. The pattern is four generations: Paul, Timothy, reliable people, others.",
    application: "Think of one person in your life who is younger in faith or newer to Christ. What would it look like to invest deliberately in their growth this week?",
    reflection: "You are not just a disciple — you are a link in a chain that goes back to Jesus and forward to people not yet born.",
    actionStep: "Write the name of one person you could begin to invest in spiritually. Pray for them by name today.",
  },
  {
    id: "curr-mt-5-16", planId: "curriculum", dayNumber: 2, totalDays: 20,
    reference: "Matthew 5:16",
    verseLines: ["\"In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.\""],
    simpleMeaning: "Your life is a witness. The way you live — your kindness, integrity, and love — points people toward God when it is lived openly.",
    context: "Jesus says this in the Sermon on the Mount, just after calling His followers the light of the world. The image is a lamp placed on a stand — not hidden, not showing off, but simply visible to all in the house.",
    application: "What would it look like today to do one act of goodness so naturally and openly that people ask why you do it?",
    reflection: "The goal is not to impress — it is to point. When your life shines, the credit goes to God, not you.",
    actionStep: "Do one deliberate act of kindness today for someone who cannot repay you.",
  },
  {
    id: "curr-jn-15-5", planId: "curriculum", dayNumber: 3, totalDays: 20,
    reference: "John 15:5",
    verseLines: ["\"I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.\""],
    simpleMeaning: "Fruitfulness in the Christian life is not about trying harder — it is about staying connected. A branch does not strain to produce fruit; it simply remains attached to the vine.",
    context: "Jesus speaks these words in the upper room on the night before His crucifixion. He uses the image of a vineyard to explain the relationship between abiding and fruitfulness. The branch has no independent life.",
    application: "Where in your life are you straining to produce results through your own effort rather than remaining connected to Christ in prayer and Scripture?",
    reflection: "Apart from me you can do nothing — not less, not little. Nothing. Abiding is not optional for the fruitful life.",
    actionStep: "Spend 10 minutes in silence today, not asking for anything — just remaining present with Christ.",
  },
  {
    id: "curr-ps-46", planId: "curriculum", dayNumber: 4, totalDays: 20,
    reference: "Psalm 46:10",
    verseLines: ["\"He says, 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.'\""],
    simpleMeaning: "The command to be still is not passive — it is an act of trust. In the middle of chaos, God invites us to stop striving and recognize who He is.",
    context: "Psalm 46 describes a world in upheaval — mountains falling into the sea, nations in uproar. Yet the refrain is 'God is our refuge.' The call to stillness comes not despite the chaos but in the middle of it.",
    application: "What noise in your life makes stillness feel impossible right now? Bring that exact situation into a moment of intentional quiet today.",
    reflection: "You cannot know God more deeply while constantly rushing past Him.",
    actionStep: "Find 5 minutes today to sit in complete silence. No phone. No podcast. Just stillness with God.",
  },
  {
    id: "curr-1sam-3", planId: "curriculum", dayNumber: 5, totalDays: 20,
    reference: "1 Samuel 3:10",
    verseLines: ["\"The Lord came and stood there, calling as at the other times, 'Samuel! Samuel!' Then Samuel said, 'Speak, Lord, for your servant is listening.'\""],
    simpleMeaning: "Hearing God requires intentional listening posture. Samuel's breakthrough came when he stopped responding to the voice and started responding to the one speaking.",
    context: "Samuel is a boy serving in the Temple under Eli. He hears his name called three times and each time assumes it is Eli. It is Eli who recognizes it is God speaking and teaches Samuel what to say. Sometimes we need others to help us recognize God's voice.",
    application: "What would it look like to begin your quiet time not with a list of requests but with the posture: 'Speak, Lord, for your servant is listening'?",
    reflection: "God speaks to those who position themselves to hear, not just those who ask for answers.",
    actionStep: "In your prayer time today, spend the first 5 minutes only listening. Write down any thought, impression, or verse that comes to mind.",
  },
  {
    id: "curr-dt-6-4", planId: "curriculum", dayNumber: 6, totalDays: 20,
    reference: "Deuteronomy 6:4",
    verseLines: ["\"Hear, O Israel: The Lord our God, the Lord is one.\""],
    simpleMeaning: "The Shema — the ancient declaration of Jewish faith — establishes that God is one: undivided, fully present, and uniquely worthy of total devotion.",
    context: "Moses speaks these words to the Israelites on the edge of the Promised Land. The Shema is the foundation for 'Love the Lord your God with all your heart, soul, and strength' in verse 5. Oneness demands wholeness of response.",
    application: "Because God is one and not divided, your devotion to Him should not be divided either. Where are you serving two masters in your life right now?",
    reflection: "A God who is fully one deserves a heart that is fully His.",
    actionStep: "Pray the Shema slowly: 'The Lord our God, the Lord is one.' Then ask God to show you where your devotion has been divided.",
  },
  {
    id: "curr-rom-3-23", planId: "curriculum", dayNumber: 7, totalDays: 20,
    reference: "Romans 3:23",
    verseLines: ["\"For all have sinned and fall short of the glory of God.\""],
    simpleMeaning: "Sin is not a problem only for especially bad people — it is the universal human condition. Every person, without exception, has missed the mark God created us to hit.",
    context: "Paul writes this showing that both Gentiles and Jews stand equally condemned before God. The word 'all' is the great leveler — no category of person is excluded.",
    application: "Where do you find yourself comparing your sin to others' rather than measuring it against God's holiness? This verse removes that option.",
    reflection: "Fall short of the glory of God — the standard is not other people. It is God Himself. That is why grace is the only answer.",
    actionStep: "Write an honest one-sentence confession of a specific area where you know you fall short. Then receive the grace that Romans 3:24 immediately offers.",
  },
  {
    id: "curr-rom-6-23", planId: "curriculum", dayNumber: 8, totalDays: 20,
    reference: "Romans 6:23",
    verseLines: ["\"For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.\""],
    simpleMeaning: "Sin has a consequence — death, separation from God. But God's response to that consequence is not judgment alone. It is a gift: eternal life through Jesus.",
    context: "Paul contrasts 'wages' and 'gift' to make a striking point: death is what sin earns, but life is what God freely gives. You cannot earn life any more than you earn grace.",
    application: "Where are you treating sin casually because of a general sense that 'God will forgive anyway'? This verse invites honest reflection on what sin actually costs.",
    reflection: "The same verse that names the consequence also names the cure. That is the gospel in one sentence.",
    actionStep: "Pray through both halves of this verse — acknowledge the wages of sin in your own life, then thank God specifically for the gift.",
  },
  {
    id: "curr-mk-2-17", planId: "curriculum", dayNumber: 9, totalDays: 20,
    reference: "Mark 2:17",
    verseLines: ["\"On hearing this, Jesus said to them, 'It is not the healthy who need a doctor, but the sick. I have not come to call the righteous, but sinners.'\""],
    simpleMeaning: "Jesus did not come for people who think they have it together. He came specifically for those who know they are broken and need saving.",
    context: "Jesus has just called Levi (Matthew) — a tax collector and social outcast — and is eating at his house with sinners. The religious leaders are scandalized. Jesus reframes the scene: this is not a scandal, it is exactly the mission.",
    application: "In what areas of your life do you present a polished version of yourself to God rather than bringing your actual brokenness to Him?",
    reflection: "Jesus moved toward the sick, not away from them. He still does.",
    actionStep: "Come to God today not with your best, but with your most honest. Bring one area of genuine need and ask Him directly for help.",
  },
  {
    id: "curr-eph-2-8", planId: "curriculum", dayNumber: 10, totalDays: 20,
    reference: "Ephesians 2:8",
    verseLines: ["\"For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.\""],
    simpleMeaning: "Salvation is entirely God's initiative and God's gift. Faith is the hand that receives it, but even the ability to believe is from Him — not something you manufactured on your own.",
    context: "Paul writes this after one of the most dramatic contrasts in Scripture: 'you were dead' and 'God made us alive.' The language of gift removes all grounds for human boasting. Grace is not a reward for spiritual effort — it is the source of spiritual life.",
    application: "Where in your faith life are you quietly keeping score — as if God's approval depends on your performance? This verse invites you to receive rather than earn.",
    reflection: "A gift cannot be earned. If it could be earned, it would not be grace.",
    actionStep: "Pray this: 'God, I receive today what I cannot earn: your grace. Help me live from that gift, not toward it.'",
  },
  {
    id: "curr-tit-3-5", planId: "curriculum", dayNumber: 11, totalDays: 20,
    reference: "Titus 3:5",
    verseLines: ["\"He saved us, not because of righteous things we had done, but because of his mercy. He saved us through the washing of rebirth and renewing by the Holy Spirit.\""],
    simpleMeaning: "God did not save us because we deserved it or cleaned ourselves up. He saved us out of mercy alone — a complete transformation from the inside out.",
    context: "Paul writes to Titus about how Christians should live in society. Before he gives instructions, he anchors behavior in identity: we were once foolish and enslaved, but God saved us by mercy, not merit.",
    application: "Are you living as someone who is being renewed from within, or are you still trying to clean up your outside while the inside stays the same?",
    reflection: "The Holy Spirit is not a finishing touch on your effort. He is the agent of rebirth itself.",
    actionStep: "Ask the Holy Spirit today: 'Where are you renewing me that I haven't noticed yet?'",
  },
  {
    id: "curr-acts-1-8", planId: "curriculum", dayNumber: 12, totalDays: 20,
    reference: "Acts 1:8",
    verseLines: ["\"But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.\""],
    simpleMeaning: "The mission of the church is empowered by the Holy Spirit, not human ambition. Witness begins where you are — your Jerusalem — and radiates outward from there.",
    context: "These are the last words of Jesus before His ascension. He does not give a strategic plan — He gives a promise: the Spirit's power. The geographic movement models the expanding reach of witness from the center outward.",
    application: "What is your 'Jerusalem' — the people closest to you who need to see Christ lived out? Start there before thinking about the ends of the earth.",
    reflection: "The power for witness comes from the Spirit, but the step of witness must come from you.",
    actionStep: "Identify one person in your 'Jerusalem' — home, workplace, neighborhood — and pray for an opportunity to be a witness to them this week.",
  },
  {
    id: "curr-jn-16-13", planId: "curriculum", dayNumber: 13, totalDays: 20,
    reference: "John 16:13",
    verseLines: ["\"But when he, the Spirit of truth, comes, he will guide you into all the truth. He will not speak on his own; he will speak only what he hears, and he will tell you what is yet to come.\""],
    simpleMeaning: "The Holy Spirit is not silent. He actively leads believers into truth — the living application of God's word to every situation.",
    context: "Jesus is preparing His disciples for His departure. The promise of the Spirit as guide was meant to be a comfort: 'I am leaving, but you will not be without direction.' The Spirit speaks in alignment with the Father and Son.",
    application: "In a decision you face right now, are you relying on your own reasoning or actively asking the Spirit of truth for guidance?",
    reflection: "The Spirit leads those who are willing to follow, not just those who want answers.",
    actionStep: "Bring one specific question or decision to God today. Ask the Spirit of truth for guidance and sit quietly with it.",
  },
  {
    id: "curr-acts-2-4", planId: "curriculum", dayNumber: 14, totalDays: 20,
    reference: "Acts 2:4",
    verseLines: ["\"All of them were filled with the Holy Spirit and began to speak in other tongues as the Spirit enabled them.\""],
    simpleMeaning: "Pentecost was the fulfillment of Jesus's promise. The Spirit came with power and immediately empowered the disciples to speak across every language barrier.",
    context: "Fifty days after Passover, Jewish pilgrims from every nation were in Jerusalem. The Spirit descended and the disciples spoke in languages they had never learned — a direct reversal of Babel. The first act of Spirit-filled power was the gospel reaching all people.",
    application: "The Spirit's power was given not for private spiritual experience but for public witness. How are you using the gifts you have been given in service to others?",
    reflection: "Every language heard the gospel that day. God's intent has always been that no one would be unreachable.",
    actionStep: "Ask God: 'What gift have you placed in me for the benefit of others that I am not using?'",
  },
  {
    id: "curr-gal-5-23", planId: "curriculum", dayNumber: 15, totalDays: 20,
    reference: "Galatians 5:23",
    verseLines: ["\"...gentleness and self-control. Against such things there is no law.\""],
    simpleMeaning: "Gentleness and self-control are not weakness — they are the fruit of the Spirit working in the hardest places of our character.",
    context: "Paul ends his list of the fruit of the Spirit with gentleness and self-control. Both virtues require strength, not its absence. Gentleness (Greek: prautes) was used of a tamed war horse — power under discipline. Self-control is the ability to not be ruled by impulse.",
    application: "Where in your life is impulse winning over discipline right now? That is the exact place where the Spirit wants to produce fruit.",
    reflection: "Fruit grows — it is not manufactured. But it only grows in a branch that stays attached.",
    actionStep: "Identify one area where you consistently struggle with self-control. Ask the Spirit specifically for growth in that area today.",
  },
  {
    id: "curr-1cor-12-27", planId: "curriculum", dayNumber: 16, totalDays: 20,
    reference: "1 Corinthians 12:27",
    verseLines: ["\"Now you are the body of Christ, and each one of you is a part of it.\""],
    simpleMeaning: "You are not an optional accessory to the church — you are a necessary part of the body of Christ. Every member matters, and every absence creates a gap.",
    context: "Paul uses the human body as a metaphor for the church. Just as a body has many parts with different functions, all necessary, so the church has many members with different gifts. No member can say 'I don't need you,' and no member can say 'I don't belong.'",
    application: "How are you functioning as your part in the body? Are you showing up, contributing, and staying connected to the community God placed you in?",
    reflection: "A body part disconnected from the body does not flourish — it withers. The same is true for believers disconnected from community.",
    actionStep: "Engage with your church community this week in a specific way — attend, serve, encourage, or reconnect with someone you have been distant from.",
  },
  {
    id: "curr-eph-4-3", planId: "curriculum", dayNumber: 17, totalDays: 20,
    reference: "Ephesians 4:3",
    verseLines: ["\"Make every effort to keep the unity of the Spirit through the bond of peace.\""],
    simpleMeaning: "Unity is not something we create — the Spirit has already created it. Our job is to protect it, and that takes deliberate effort.",
    context: "Paul writes to a church containing both Jewish and Gentile believers — two groups with deep historical division. He calls them to 'walk worthy' and lists humility, gentleness, patience, and forbearance in love as the qualities that protect unity.",
    application: "Is there a relationship in your church or community where division has taken root? What would 'making every effort' look like in that specific situation?",
    reflection: "Peace in the body of Christ is a bond, not a feeling. Bonds require maintenance.",
    actionStep: "Reach out today to encourage someone in your church or small group who you have not spoken to in a while.",
  },
  {
    id: "curr-gal-5-13", planId: "curriculum", dayNumber: 18, totalDays: 20,
    reference: "Galatians 5:13",
    verseLines: ["\"You, my brothers and sisters, were called to be free. But do not use your freedom to indulge the flesh; rather, serve one another humbly in love.\""],
    simpleMeaning: "Christian freedom is not freedom from responsibility — it is freedom for love. Liberty from sin is not a license to please yourself but a capacity to serve others.",
    context: "Paul has just argued powerfully for freedom from the law. Now he clarifies: freedom from law is not freedom from love. The entire law is fulfilled in 'love your neighbor as yourself.' Grace produces self-giving, not self-centeredness.",
    application: "Where are you using your freedom in Christ as permission to avoid serving or sacrificing for others?",
    reflection: "Serve one another humbly in love — this is not a burden. It is what freedom looks like when it is lived outward.",
    actionStep: "Do one act of service today for someone in your community — small, specific, and offered without expectation of recognition.",
  },
  {
    id: "curr-eph-6-11", planId: "curriculum", dayNumber: 19, totalDays: 20,
    reference: "Ephesians 6:11",
    verseLines: ["\"Put on the full armor of God, so that you can take your stand against the devil's schemes.\""],
    simpleMeaning: "The spiritual battle requires specific preparation. God has provided armor — but it must be deliberately put on, not assumed.",
    context: "Paul describes six pieces of armor in Ephesians 6, each corresponding to a piece of Roman soldier's equipment. The image is of standing firm — the armor is for defense against an already-defeated enemy who is still dangerous. 'Schemes' implies calculated tactics.",
    application: "Which piece of the armor — truth, righteousness, peace, faith, salvation, the Word — do you most neglect? That gap is likely where you experience the most spiritual pressure.",
    reflection: "You cannot stand against what you refuse to acknowledge exists.",
    actionStep: "Read through Ephesians 6:13-17. Pray through each piece of armor, asking God to make it real and active in your life today.",
  },
  {
    id: "curr-jas-4-7", planId: "curriculum", dayNumber: 20, totalDays: 20,
    reference: "James 4:7",
    verseLines: ["\"Submit yourselves, then, to God. Resist the devil, and he will flee from you.\""],
    simpleMeaning: "Victory in spiritual warfare begins with surrender — not to the enemy, but to God. Submission to God is what gives resistance its power.",
    context: "James writes to a scattered, struggling church dealing with fights, worldliness, and pride. Before he addresses outward conflict, he diagnoses the root: unsubmitted hearts. The order matters — submit first, then resist. Without submission to God, resistance is just willpower, which will eventually fail.",
    application: "Is there an area of your life where you are trying to resist the devil without first fully submitting that area to God?",
    reflection: "The devil does not flee from loud voices — he flees from submitted, God-covered lives.",
    actionStep: "Identify one area of spiritual pressure in your life. Pray: 'God, I submit this to you. I resist the enemy's hold on it in your authority.'",
  },
];
