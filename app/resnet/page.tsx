'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function ResNetPage() {
  const [imageUrl, setImageUrl] = useState('')
  const [classification, setClassification] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`/api/resnet?imgurl=${encodeURIComponent(imageUrl)}`)
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data = await response.json()
      setClassification(data.classification)
    } catch (error) {
      console.error('Error classifying image:', error)
      toast({
        title: "Error",
        description: "Failed to classify image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Image Classification</h1>
      <Card>
        <CardHeader>
          <CardTitle>Classify Image using ResNet-50</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Classifying...
                </>
              ) : (
                'Classify Image'
              )}
            </Button>
          </form>
          {imageUrl && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Image:</h2>
              <div className="relative w-full h-64">
                <Image src={imageUrl} alt="Classified Image" layout="fill" objectFit="contain" className="rounded-lg" />
              </div>
            </div>
          )}
          {classification && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Classification Result:</h2>
              <p className="p-4 bg-secondary rounded-md">{classification}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

