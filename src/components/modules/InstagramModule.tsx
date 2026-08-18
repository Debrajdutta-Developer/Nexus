import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Film, Eye, Flame } from 'lucide-react';

export const InstagramModule: React.FC = () => {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'reels' | 'feed' | 'stories'>('reels');

  const posts = [
    {
      id: 1,
      user: 'nexus_spatial_lab',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      caption: 'Testing 3D Volumetric Spatial Feed in NEXUS OS kernel. Zero latency holographic rendering.',
      likes: '42.8k',
      comments: '1,204',
      time: '12m ago'
    },
    {
      id: 2,
      user: 'cyber_architecture',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      caption: 'Minimalist glassmorphic spatial pavilion designed in Vision Engine.',
      likes: '19.4k',
      comments: '482',
      time: '1h ago'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Module Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
            <Film className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wider text-cyan-100 uppercase">SPATIAL INSTAGRAM FEED</h2>
            <p className="text-xs text-cyan-400/60 font-mono">VOLUMETRIC REELS & MEDIA // LIVE STREAM</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(['reels', 'feed', 'stories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs uppercase font-semibold rounded-lg border transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                  : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-cyan-500/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feed Content */}
      <div className="flex-1 overflow-y-auto my-4 space-y-5 pr-2 custom-scrollbar">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative rounded-xl border border-cyan-500/15 bg-slate-900/40 p-4 transition-all hover:border-cyan-400/40 hover:bg-slate-900/60"
          >
            {/* User Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <img src={post.avatar} alt="avatar" className="w-7 h-7 rounded-full border border-cyan-400/40 object-cover" />
                <span className="text-xs font-bold text-cyan-200">@{post.user}</span>
              </div>
              <span className="text-[10px] text-cyan-400/50">{post.time}</span>
            </div>

            {/* Media Canvas Box */}
            <div className="relative rounded-lg overflow-hidden border border-cyan-500/20 aspect-video mb-3 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all">
              <img src={post.image} alt="post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-cyan-300 border border-cyan-400/30 backdrop-blur-sm flex items-center gap-1">
                <Eye className="w-3 h-3" /> 3D SPATIAL
              </div>
            </div>

            {/* Caption & Actions */}
            <p className="text-xs text-slate-300 leading-relaxed mb-3 font-mono">{post.caption}</p>

            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/10 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLiked((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                  className={`flex items-center gap-1.5 transition-colors ${
                    liked[post.id] ? 'text-red-400' : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked[post.id] ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
              <div className="flex gap-2 text-slate-400">
                <Share2 className="w-4 h-4 hover:text-cyan-300 cursor-pointer" />
                <Bookmark className="w-4 h-4 hover:text-cyan-300 cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-400/70">
        <span className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-orange-400" /> SPATIAL ENGINE ACTIVE
        </span>
        <span>LATENCY: 4.2ms</span>
      </div>
    </div>
  );
};
