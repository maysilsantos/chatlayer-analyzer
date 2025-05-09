import type { Message } from "@/context/app-state-context"

// Mock conversation based on the provided images
export const getMockConversation = (conversationId: string): Message[] => {
  return [
    // Initial bike image and greeting
    {
      actor: "bot",
      text: "Hey rider 🚲 I'm your virtual agent from Team Bike. I can guide you if you don't know what to look for, book checkups and try-outs, or even track your order 😊\nHow can I help you today?",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-y3E2mZCSjfPC5yLu25ZcMT8EPyw7hY.png",
    },
    {
      actor: "user",
      text: "Book checkup.",
    },
    // Bot didn't understand
    {
      actor: "bot",
      text: "I'm afraid I didn't catch that... But here are topics that I can help you with 😊",
      quickReplies: [
        { text: "I'm new", iconName: "check" },
        { text: "Book checkup", iconName: "check" },
        { text: "Book try-out", iconName: "check" },
        { text: "Track order", iconName: "check" },
      ],
    },
    // User selects book checkup
    {
      actor: "user",
      text: "Book checkup",
    },
    // Bot offers appointment
    {
      actor: "bot",
      text: "Need a checkup or repair? I can book an appointment for you so that we look into it 👀\nWould tomorrow at 10am suit you?",
      quickReplies: [
        { text: "Book it", iconName: "check" },
        { text: "Other slots", iconName: "calendar" },
      ],
    },
    // User confirms
    {
      actor: "user",
      text: "Book it",
    },
    // Bot asks for bike model
    {
      actor: "bot",
      text: "Alright, let's book this one!\nWhat's the bike model that needs to be checked?",
      quickReplies: [
        { text: "James", iconName: "" },
        { text: "Robin", iconName: "" },
        { text: "Charlie", iconName: "" },
      ],
    },
    // User selects model
    {
      actor: "user",
      text: "James",
    },
    // Bot asks for additional info
    {
      actor: "bot",
      text: "A bike, noted. Would you like to add a note if there is something special that we should know beforehand?",
    },
    // User says no
    {
      actor: "user",
      text: "No.",
    },
    // Bot asks for email
    {
      actor: "bot",
      text: "Fine, let me just take your info now so that we can confirm the appointment by email.\nWhat email address can we use?",
    },
    // User provides email
    {
      actor: "user",
      text: "john.doe@email.com",
    },
    // Bot asks for name
    {
      actor: "bot",
      text: "And your name please?",
    },
    // User provides name
    {
      actor: "user",
      text: "John Doe",
    },
    // Bot confirms appointment
    {
      actor: "bot",
      text: "You should have received a confirmation in your mailbox 😊 Thanks for reaching John Doe!",
    },
  ]
}

// Mock analysis result in English
export const getMockAnalysisResult = (): string => {
  return `
## Conversation Analysis

### Strengths:
- The bot provided clear options for the user to select from
- The appointment booking flow was straightforward and efficient
- The bot confirmed the appointment details and sent a confirmation email
- The bot maintained a friendly tone throughout the conversation

### Areas for Improvement:
- The bot initially didn't understand the "Book checkup" request, which created an unnecessary step
- The bot didn't ask about the specific issues with the bike that need checking
- No information was provided about the expected duration or cost of the checkup
- The bot didn't offer alternative dates before asking for personal information

### Recommendations:
1. Improve the natural language understanding to better recognize common requests like "Book checkup"
2. Add a step to ask about specific issues with the bike to better prepare the technician
3. Provide information about the expected duration and cost of the service
4. Offer a wider range of appointment slots before proceeding with the booking
5. Add a follow-up message a day before the appointment as a reminder
  `
}
