'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from "next-themes"

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Prompt', href: '/prompt' },
  { name: 'Translate', href: '/translate' },
  { name: 'Image', href: '/image' },
  { name: 'Whisper', href: '/whisper' },
  { name: 'ResNet', href: '/resnet' },
  { name: 'Defog', href: '/defog' },
  { name: 'Classification', href: '/classification' },
  { name: 'BAAI', href: '/baai' },
  { name: 'AI', href: '/ai' },
  { name: 'Code', href: '/code' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">AI Tools Hub</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
              <span className="font-bold">AI Tools Hub</span>
            </MobileLink>
            <div className="my-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}>
                  {item.name}
                </MobileLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="mr-6"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && (theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />)}
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        pathname === href && "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

