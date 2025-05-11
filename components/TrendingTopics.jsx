'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TrendingTopics() {
  const [newsItems, setNewsItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const dummyNews = [
      {
        title: 'Derek Carr Announces Retirement',
        content: 'Saints HC Kellen Moore confirms QB\'s surprise retirement.',
        date: 'May 10, 2025',
        category: 'Transactions',
        team: 'Saints',
        player: 'Derek Carr',
        tags: ['QB', 'retire']
      },
      {
        title: 'J.J. McCarthy Named QB1 for Vikings',
        content: 'Vikings confirm J.J. McCarthy as starter for Week 1.',
        date: 'May 8, 2025',
        category: 'Transactions',
        team: 'Vikings',
        player: 'J.J. McCarthy',
        tags: ['QB', 'starter']
      },
      {
        title: 'Sean Payton to Coach Broncos in 2025',
        content: 'Broncos GM explains 2025 expectations.',
        date: 'May 7, 2025',
        category: 'Coaching',
        team: 'Broncos',
        player: '',
        tags: ['coach', 'Broncos']
      },
      {
        title: 'New Kickoff Rule Approved by NFL',
        content: 'Roger Goodell: "Kickoff rule changes are for player safety."',
        date: 'May 6, 2025',
        category: 'Rules',
        team: '',
        player: '',
        tags: ['rules', 'kickoff']
      }
    ]

    setNewsItems(dummyNews)
  }, [])

  const filteredNews = newsItems.filter(item => {
    const query = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.team?.toLowerCase().includes(query) ||
      item.player?.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  })

  return (
    
