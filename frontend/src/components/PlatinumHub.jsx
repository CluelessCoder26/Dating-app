import React from 'react';

const PlatinumHub = () => {
    return (
        <main className="flex-grow pt-24 pb-32 px-container-padding-mobile md:px-container-padding-desktop w-full max-w-7xl mx-auto overflow-y-auto hide-scrollbar selection:bg-primary-fixed selection:text-primary">
{/*  Hero Section  */}
<section className="mb-stack-lg text-center">
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-label-md text-label-md mb-6 floating">
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "'FILL' 1"}}>star</span>
                PLATINUM STATUS
            </div>
<h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4 text-on-surface">The Pinnacle of Connection</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Elevate your experience with curated features designed for those who value time and intentionality.</p>
</section>
{/*  Feature Bento Grid  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg">
{/*  Feature 1: Priority Likes  */}
<div className="md:col-span-8 glass-card rounded-xl p-stack-md flex flex-col md:flex-row gap-gutter overflow-hidden relative group">
<div className="flex-1 flex flex-col justify-center order-2 md:order-1">
<span className="material-symbols-outlined text-primary text-4xl mb-4" style={{"fontVariationSettings": "'FILL' 1"}}>priority_high</span>
<h3 className="font-headline-lg text-headline-lg mb-2">Priority Likes</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Your likes are seen first. Skip the queue and land directly at the top of their discovery stack.</p>
</div>
<div className="flex-1 h-64 md:h-auto relative order-1 md:order-2 rounded-lg overflow-hidden">
<img alt="Priority interaction" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A sophisticated close-up of a high-end smartphone display showing a premium dating app interface. The screen is filled with warm, golden light reflections against a soft azure background. A stylized, glowing heart icon is prominently featured, surrounded by elegant, minimalist typography and floating glassmorphic UI elements that suggest a luxurious digital experience in a modern, serene setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD51erah2pUXTsMVlmEVktNfH31SInR_IY_SrdTq_Jq-rRfS0i59r5_iStLFUys_Xgcs0_wPxPL6F63xgrwNCiI-kcKT-WWwNPUMdt2vHMNQIjuwemogunyebaLwCTAiPhpoOjPP0n_flbPwY56wbwvI52MCuFKdjw-VyshqXhLDTpmbOZXyd1pKBuZWbWsBFjGMH9FB3GaYqFzGC0WDZyvl-zvv6ixCl0l0_rf6NJQx6gCWyIav-oFVBk-waAy7ovRVdj0fB7GDvKG"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
</div>
</div>
{/*  Feature 2: Message Before Matching  */}
<div className="md:col-span-4 glass-card rounded-xl p-stack-md flex flex-col justify-between group">
<div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-primary text-3xl">send</span>
</div>
<div>
<h3 className="font-headline-md text-headline-md mb-2">Message Before Matching</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Make a lasting first impression. Attach a thoughtful note to every like you send.</p>
</div>
<div className="mt-6 border-t border-outline-variant/30 pt-4 flex items-center justify-between">
<span className="text-primary font-label-md text-label-md">Unlimited Access</span>
<span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
</div>
</div>
{/*  Feature 3: Advanced Filters  */}
<div className="md:col-span-4 glass-card rounded-xl p-stack-md group">
<div className="aspect-square rounded-lg bg-surface-container-low mb-6 overflow-hidden flex items-center justify-center relative">
<span className="material-symbols-outlined text-primary text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">filter_list</span>
<div className="absolute inset-0 flex flex-col gap-2 p-4 justify-center">
<div className="h-8 w-3/4 bg-white/80 rounded-full blur-[2px]"></div>
<div className="h-8 w-1/2 bg-white/80 rounded-full blur-[2px] self-end"></div>
<div className="h-8 w-2/3 bg-white/80 rounded-full blur-[2px]"></div>
</div>
</div>
<h3 className="font-headline-md text-headline-md mb-2">Advanced Filters</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Filter by education, lifestyle choices, and future goals to find your exact match.</p>
</div>
{/*  Feature 4: Premium Badge & Profile  */}
<div className="md:col-span-8 glass-card rounded-xl overflow-hidden flex flex-col md:flex-row-reverse relative group">
<div className="flex-1 p-stack-md flex flex-col justify-center">
<h3 className="font-headline-lg text-headline-lg mb-2">Platinum Identity</h3>
<p className="font-body-md text-body-md text-on-surface-variant mb-6">A subtle, luminous badge on your profile signals your commitment to quality connections.</p>
<button className="w-fit px-8 py-3 rounded-xl premium-gradient text-white font-label-md text-label-md shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
                        Upgrade Now
                    </button>
</div>
<div className="flex-1 h-64 md:h-auto">
<img alt="Premium User Profile" className="w-full h-full object-cover" data-alt="A professional portrait of a confident and elegant individual in a high-end, minimalist architectural setting. The lighting is soft and flattering, creating a premium light-mode aesthetic with cool blue and silver highlights. The background features blurred glass walls and clean lines, emphasizing a sense of exclusivity and luxury. The overall atmosphere is sophisticated, serene, and aspirational." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3QXMShY_8zdiys-YBuypfU7LTyhwv86QLgokz7ewUIXo_AVibLvjeOQ1PdARlXGopeBJfa7GU0AZu9LkQ-aBXipJgHXwTvt6rfaaOuLwJsaroSsxc5qBiRH7zR5FZV7F72E5Dv2T1gkfsbstpGR6A1MOwpKmuv-ZGEQac0yxvhiXGJmtYQaYqdlsdJr2xe3lI59TdFtyWHsM6Fcu_kVsBiM1NLKD16vXgCeongKvuZX6FIlutfpnThNNvTuFC8coWqToOMyAInyqT"/>
</div>
</div>
</div>
{/*  Exclusive Perks List  */}
<section className="mt-stack-lg">
<h3 className="font-headline-lg text-headline-lg mb-gutter text-center">Exclusive Perks</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 bg-white/50 hover:bg-white transition-colors cursor-default">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary">visibility_off</span>
</div>
<div>
<h4 className="font-headline-md text-body-lg font-bold">Incognito Mode</h4>
<p className="font-body-md text-label-sm text-on-surface-variant">Control who sees your profile</p>
</div>
</div>
<div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 bg-white/50 hover:bg-white transition-colors cursor-default">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary">public</span>
</div>
<div>
<h4 className="font-headline-md text-body-lg font-bold">Passport</h4>
<p className="font-body-md text-label-sm text-on-surface-variant">Match with people anywhere in the world</p>
</div>
</div>
<div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 bg-white/50 hover:bg-white transition-colors cursor-default">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary">history</span>
</div>
<div>
<h4 className="font-headline-md text-body-lg font-bold">Rewind</h4>
<p className="font-body-md text-label-sm text-on-surface-variant">Bring back your last left swipe</p>
</div>
</div>
<div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 bg-white/50 hover:bg-white transition-colors cursor-default">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary">bolt</span>
</div>
<div>
<h4 className="font-headline-md text-body-lg font-bold">1 Free Boost</h4>
<p className="font-body-md text-label-sm text-on-surface-variant">Be the top profile in your area for 30 minutes</p>
</div>
</div>
</div>
</section>
        </main>
    );
};

export default PlatinumHub;
