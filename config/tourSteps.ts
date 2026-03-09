// Tour Steps Configuration
// Edit this file to customize your AI tour experience

export type TourStepConfig = {
    id: string                    // Unique identifier for this step
    message: string               // Message displayed by the robot (supports typewriter effect)
    page?: string                 // Optional: Navigate to this page (e.g., '/blogs', '/about')
    section?: string              // Optional: Scroll to this section ID on the page
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
    duration?: number             // Optional: How long to display this step (milliseconds)
}

// 🎯 TOUR STEPS - Edit these to customize your tour!
export const TOUR_STEPS: TourStepConfig[] = [
    {
        id: 'welcome',
        message: "Salam! 👋 I'm Einsteine, your AI guide. I'm here to show you around this amazing platform. Would you like a quick tour?",
        position: 'bottom-right',
        duration: 5000
    },
    {
        id: 'features',
        message: "This platform combines AI-powered blogging with intelligent content delivery. Let me show you the key features!",
        position: 'bottom-right',
        duration: 4000
    },
    {
        id: 'ai-interaction',
        message: "I can help you find content, answer questions, and guide you through your learning journey. I'm powered by advanced LangChain AI!",
        position: 'bottom-right',
        duration: 5000
    },
    {
        id: 'blogs',
        message: "Ready to explore our blog content? Let me take you there!",
        page: '/blogs',              // 🔄 This will navigate to the blogs page
        position: 'bottom-right',
        duration: 3000
    },
    {
        id: 'categories',
        message: "You can browse content by categories, search for specific topics, or let me recommend something based on your interests!",
        position: 'bottom-right',
        duration: 5000
    },
    {
        id: 'chat-intro',
        message: "Anytime you need help, just click on me! I can answer questions, explain concepts, or help you navigate. Want to try chatting now?",
        position: 'bottom-right',
        duration: 5000
    }
]

// 🎲 Helper function to get random entrance direction
export const getRandomEntranceDirection = (): 'top' | 'bottom' | 'left' | 'right' => {
    const directions: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right']
    return directions[Math.floor(Math.random() * directions.length)]
}

// 📝 CUSTOMIZATION TIPS:
//
// 1. ADD A NEW STEP:
//    Copy an existing step and modify the properties
//    Example:
//    {
//      id: 'contact',
//      message: "Need help? Visit our contact page!",
//      page: '/contact',
//      position: 'bottom-right',
//      duration: 4000
//    }
//
// 2. NAVIGATE TO A PAGE:
//    Add the 'page' property with the route path
//    Example: page: '/about'
//
// 3. SCROLL TO A SECTION:
//    Add the 'section' property with the element ID
//    Example: section: 'features-section'
//    (Make sure the element has id="features-section")
//
// 4. CHANGE ROBOT POSITION:
//    Modify the 'position' property
//    Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left', 'center'
//
// 5. ADJUST TIMING:
//    Change the 'duration' value (in milliseconds)
//    Example: duration: 3000 (3 seconds)
//
// 6. EMOJIS IN MESSAGES:
//    Feel free to use emojis! They make the tour more engaging
//    Example: "Welcome! 🎉 Let's get started! 🚀"
//
// 7. MULTI-LINE MESSAGES:
//    Use \n for line breaks in messages
//    Example: "Welcome!\n\nLet me show you around."

// 🔧 ADVANCED: Backend Integration
// To integrate with your LangChain/LangGraph backend:
//
// 1. Create a function to fetch dynamic tour steps from your API
// 2. Replace TOUR_STEPS with the API response
// 3. Example:
//
// export const fetchTourSteps = async (): Promise<TourStepConfig[]> => {
//   const response = await fetch('/api/tour-steps')
//   return response.json()
// }
//
// Then in TourContext.tsx, load steps dynamically:
// const [tourSteps, setTourSteps] = useState<TourStepConfig[]>([])
// useEffect(() => {
//   fetchTourSteps().then(setTourSteps)
// }, [])
