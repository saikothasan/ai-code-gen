import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'

const tools = [
  { name: 'Prompt Generator', description: 'Generate creative prompts for various purposes', href: '/prompt', icon: '💡' },
  { name: 'Translator', description: 'Translate text between multiple languages', href: '/translate', icon: '🌐' },
  { name: 'Image Generator', description: 'Create images from text descriptions', href: '/image', icon: '🖼️' },
  { name: 'Audio Transcription', description: 'Convert audio to text with high accuracy', href: '/whisper', icon: '🎙️' },
  { name: 'Image Classification', description: 'Identify objects and scenes in images', href: '/resnet', icon: '🔍' },
  { name: 'SQL Generator', description: 'Create SQL queries from natural language', href: '/defog', icon: '📊' },
  { name: 'Text Classification', description: 'Categorize text into predefined classes', href: '/classification', icon: '📝' },
  { name: 'BAAI Text Generation', description: 'Generate human-like text responses', href: '/baai', icon: '🤖' },
  { name: 'Blog Post Generator', description: 'Create engaging blog posts on various topics', href: '/ai', icon: '📰' },
  { name: 'Code Generator', description: 'Generate code snippets and solutions', href: '/code', icon: '💻' },
]

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
        Welcome to AI Tools Hub
      </h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Explore our collection of powerful AI tools to enhance your productivity and creativity
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.href} className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-3xl mr-2">{tool.icon}</span>
                  {tool.name}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-end">
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

