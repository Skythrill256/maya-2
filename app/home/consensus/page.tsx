'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/main/card';
import { Share2, Search } from 'lucide-react';
import { Button } from '@/components/main/button';
import { Avatar, AvatarFallback } from '@/components/main/avatar';
import { Input } from '@/components/main/input';
import { useHighestVotes } from '@/hooks/useHighestVote';
import type { Proposal } from '@/hooks/useHighestVote';

function ProposalCountdown({ endTime }: { endTime: bigint }) {
  const calculateTimeLeft = useCallback(() => {
    const targetDate = new Date(Number(endTime) * 1000);
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) return 'Voting Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`;
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return <span>{timeLeft}</span>;
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: proposals = [], isLoading, error } = useHighestVotes();

  const filteredProposals = useMemo(
    () =>
      proposals.filter((proposal) =>
        proposal.uri.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, proposals]
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">Loading proposals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  if (!proposals?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">No proposals found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search proposals..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProposals.map((proposal: Proposal) => (
          <Card key={proposal.id.toString()}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {proposal.proposerId.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Proposal #{proposal.id.toString()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                  <p className="text-sm font-medium leading-tight break-words">
                    {proposal.uri}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <ProposalCountdown endTime={proposal.endTime} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">
                        For: {proposal.forScore.toString()}
                      </span>
                      <span className="text-red-600">
                        Against: {proposal.againstScore.toString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
