'use client'

import { useState, useEffect, useRef } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, Save } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function AIPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedContent('')

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.body) {
      setLoading(false)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      setGeneratedContent((prev) => prev + chunk)
      
      // Scroll to the bottom of the content
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight
      }
    }

    setLoading(false)
  }

  const handleSave = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'generated_blog_post.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Blog post saved",
      description: "Your generated blog post has been saved as a text file.",
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Post Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter blog post topic..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Blog Post'
              )}
            </Button>
          </form>
          {generatedContent && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Generated Blog Post:</h2>
                <Button onClick={handleSave} variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              <div 
                ref={contentRef}
                className="prose max-w-none bg-secondary p-4 rounded-md max-h-96 overflow-y-auto"
              >
                {generatedContent.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

