'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Clock, 
  Eye, 
  ChevronRight,
  Search,
  Filter
} from 'lucide-react'
import { useState } from 'react'

const categories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of using the hosting control panel',
    articleCount: 12,
    icon: BookOpen,
  },
  {
    id: 'sites',
    name: 'Sites & Domains',
    description: 'Manage your websites and domain settings',
    articleCount: 8,
    icon: BookOpen,
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Database management and configuration',
    articleCount: 6,
    icon: BookOpen,
  },
  {
    id: 'backups',
    name: 'Backups',
    description: 'Backup and restore your data',
    articleCount: 4,
    icon: BookOpen,
  },
  {
    id: 'ssl',
    name: 'SSL & Security',
    description: 'SSL certificates and security settings',
    articleCount: 7,
    icon: BookOpen,
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Common issues and solutions',
    articleCount: 15,
    icon: BookOpen,
  },
]

const popularArticles = [
  {
    id: '1',
    title: 'How to create your first website',
    category: 'Getting Started',
    views: 1250,
    lastUpdated: '2 days ago',
    excerpt: 'Learn how to create and configure your first website using our hosting control panel.',
  },
  {
    id: '2',
    title: 'Setting up SSL certificates',
    category: 'SSL & Security',
    views: 980,
    lastUpdated: '1 week ago',
    excerpt: 'Step-by-step guide to setting up SSL certificates for your domains.',
  },
  {
    id: '3',
    title: 'Database backup and restore',
    category: 'Backups',
    views: 750,
    lastUpdated: '3 days ago',
    excerpt: 'How to backup and restore your databases safely.',
  },
  {
    id: '4',
    title: 'Troubleshooting common PHP errors',
    category: 'Troubleshooting',
    views: 650,
    lastUpdated: '5 days ago',
    excerpt: 'Common PHP errors and how to fix them.',
  },
]

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Knowledge Base</h2>
        <p className="text-muted-foreground mb-6">
          Find answers to common questions and learn how to use our platform
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <category.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary">{category.articleCount} articles</Badge>
                  </div>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between">
                  Browse Articles
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Popular Articles</h3>
        <div className="space-y-4">
          {popularArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{article.title}</h4>
                    <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {article.lastUpdated}</span>
                      </div>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
