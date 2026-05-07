import React from 'react';
import { Card as CardType } from '../data/cards';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { CreditCard, Wifi } from 'lucide-react';

interface CardVisualProps {
  card: CardType;
  className?: string;
  onClick?: () => void;
  showLink?: boolean;
}

export function CardVisual({ card, className = "", onClick, showLink = true }: CardVisualProps) {
  const CardContent = () => (
    <motion.div 
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative w-full max-w-[340px] aspect-[1.58/1] rounded-xl p-6 text-white shadow-xl overflow-hidden cursor-pointer ${className}`}
      style={{
        background: `linear-gradient(135deg, ${card.gradient_colors[0]}, ${card.gradient_colors[1]})`
      }}
      onClick={onClick}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-lg tracking-tight text-white/90 drop-shadow-md">{card.bank_name}</h3>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/70 bg-black/20 px-2 py-0.5 rounded-full inline-block mt-1">
            {card.card_type}
          </span>
        </div>
        <Wifi className="w-5 h-5 text-white/70 rotate-90" />
      </div>

      <div className="mb-6">
        <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-[4px] relative overflow-hidden">
          <div className="absolute inset-0 border border-black/10 rounded-[4px]" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/10" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/10" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="font-mono text-sm tracking-[0.2em] text-white/90 drop-shadow-sm flex justify-between px-1">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span>4242</span>
        </div>

        <div className="flex justify-between items-end">
          <div className="font-medium tracking-wide drop-shadow-md truncate pr-4 text-sm">
            {card.card_name}
          </div>
          <CreditCard className="w-8 h-8 text-white/80 shrink-0" />
        </div>
      </div>
    </motion.div>
  );

  if (showLink) {
    return (
      <Link href={`/cards/${card.id}`}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
