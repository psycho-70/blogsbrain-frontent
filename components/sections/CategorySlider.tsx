// components/CategorySlider.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollSectionHeader from '../ui/ScrollSectionHeader';

// Types defined inside the component
interface SliderItem {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    slug: string;
    metaInfo?: string;
    color?: string;
}

interface CategorySliderProps {
    items?: SliderItem[];
    autoScrollSpeed?: number;
    pauseOnHover?: boolean;
    showControls?: boolean;
    showDots?: boolean;
}

const CategorySlider: React.FC<CategorySliderProps> = ({
    items,
    autoScrollSpeed = 3000,
    pauseOnHover = true,
    showControls = true,
    showDots = true
}) => {
    // Default items if none provided
    const defaultItems: SliderItem[] = [
        {
            id: 1,
            title: 'Welcome to our Blog',
            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
            description: 'Discover the latest articles and insights.',
            slug: '',
            metaInfo: 'General',
            color: 'bg-blue-500'
        }
    ];

    const sliderRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fetchedItems, setFetchedItems] = useState<SliderItem[]>([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);

    // Fetch dynamic blogs
    useEffect(() => {
        if (items && items.length > 0) {
            setFetchedItems(items);
            setIsLoadingItems(false);
            return;
        }

        const fetchDynamicBlogs = async () => {
            try {
                // We dynamically import getBlogs from api
                const { getBlogs } = await import('@/lib/api');
                const res = await getBlogs({ per_page: 8 });

                const mapped = res.blogs.map((b: any, i: number) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500'];

                    return {
                        id: b.id,
                        title: b.title,
                        imageUrl: b.featured_image ? (b.featured_image.startsWith('http') ? b.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}${b.featured_image}`) : 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
                        description: b.excerpt || 'Read the full story...',
                        slug: b.slug || String(b.id),
                        metaInfo: b.category?.name || 'General',
                        color: colors[i % colors.length]
                    };
                });

                if (mapped.length > 0) {
                    setFetchedItems(mapped);
                } else {
                    setFetchedItems(defaultItems); // fallback
                }
            } catch (error) {
                console.error("Failed to load blogs for slider", error);
                setFetchedItems(defaultItems); // fallback if fails
            } finally {
                setIsLoadingItems(false);
            }
        };

        fetchDynamicBlogs();
    }, [items]);

    // Use fetched items or defaults
    const displayItems = fetchedItems.length > 0 ? fetchedItems : defaultItems;
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragScrollLeft, setDragScrollLeft] = useState(0);
    const scrollInterval = useRef<NodeJS.Timeout | null>(null);

    // Calculate visible items based on screen width
    const calculateVisibleItems = () => {
        if (typeof window === 'undefined') return 3;
        const width = window.innerWidth;
        if (width < 640) return 1;
        if (width < 1024) return 2;
        return 3;
    };

    const [visibleItems, setVisibleItems] = useState(3); // Start with default

    // Handle responsive visible items and styles
    useEffect(() => {
        setVisibleItems(calculateVisibleItems());

        const handleResize = () => {
            setVisibleItems(calculateVisibleItems());
        };

        // Inject styles only on client
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (document.head.contains(styleSheet)) {
                document.head.removeChild(styleSheet);
            }
        };
    }, []);

    // Function to scroll to specific index
    const scrollToIndex = (index: number) => {
        if (sliderRef.current) {
            const container = sliderRef.current;
            const card = container.children[0] as HTMLElement;
            const cardWidth = card.offsetWidth + 24; // Width + gap
            const maxIndex = displayItems.length - visibleItems;
            const safeIndex = Math.min(index, maxIndex);

            container.scrollTo({
                left: safeIndex * cardWidth,
                behavior: 'smooth'
            });
            setCurrentIndex(safeIndex);
        }
    };

    // Auto-scroll functionality
    const startAutoScroll = () => {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
        }

        scrollInterval.current = setInterval(() => {
            if (isPaused || !sliderRef.current || isDragging) return;

            const maxIndex = displayItems.length - visibleItems;
            const nextIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            scrollToIndex(nextIndex);
        }, autoScrollSpeed);
    };

    // Initialize auto-scroll
    useEffect(() => {
        startAutoScroll();

        return () => {
            if (scrollInterval.current) {
                clearInterval(scrollInterval.current);
            }
        };
    }, [currentIndex, isPaused, displayItems.length, autoScrollSpeed, visibleItems, isDragging]);

    // Manual navigation handlers
    const handlePrev = () => {
        const maxIndex = displayItems.length - visibleItems;
        const prevIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
        scrollToIndex(prevIndex);
    };

    const handleNext = () => {
        const maxIndex = displayItems.length - visibleItems;
        const nextIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        scrollToIndex(nextIndex);
    };

    // Drag functionality for mobile
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!sliderRef.current) return;

        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

        setDragStartX(clientX);
        setDragScrollLeft(sliderRef.current.scrollLeft);
        setIsPaused(true);
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !sliderRef.current) return;

        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const walk = (clientX - dragStartX) * 2;

        sliderRef.current.scrollLeft = dragScrollLeft - walk;
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setIsPaused(false);

        // Calculate new index based on scroll position
        if (sliderRef.current) {
            const container = sliderRef.current;
            const card = container.children[0] as HTMLElement;
            const cardWidth = card.offsetWidth + 24;
            const newIndex = Math.round(container.scrollLeft / cardWidth);
            setCurrentIndex(newIndex);
        }
    };

    // Mouse events for pause on hover
    const handleMouseEnter = () => {
        if (pauseOnHover) {
            setIsPaused(true);
        }
    };

    const handleMouseLeave = () => {
        if (pauseOnHover) {
            setIsPaused(false);
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToIndex(index);
        }
    };

    if (isLoadingItems) {
        return (
            <div className="w-full bg-transparent mx-auto px-4 py-8 relative max-w-7xl">
                <div className="animate-pulse flex space-x-6 overflow-hidden">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] h-80 bg-gray-800 rounded-2xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>

            <div className="w-full bg-transparent mx-auto py-12 relative">
                <div className='max-w-7xl mx-auto'>
                    <ScrollSectionHeader
                        badge="Insights"
                        titlePrefix="Explore"
                        titleHighlight="Latest Articles"
                        description="Discover our most recent blog posts and stay updated with AI news."
                    />

                    <div className="flex justify-between items-center mb-4 px-4">
                        <div />

                        {/* Navigation Controls */}
                        {showControls && (
                            <div className="flex items-center space-x-4 self-end sm:self-auto">


                                <div className="flex space-x-2">
                                    <button
                                        onClick={handlePrev}
                                        className="p-2 sm:p-3 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors shadow-sm text-white"
                                        aria-label="Previous categories"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="p-2 sm:p-3 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors shadow-sm text-white"
                                        aria-label="Next categories"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Slider Container */}
                    <div
                        ref={sliderRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={(e) => {
                            handleMouseLeave();
                            handleDragEnd();
                        }}
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                        className={`flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 cursor-grab ${isDragging ? 'cursor-grabbing' : ''
                            }`}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {displayItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex-shrink-0 w-[280px] sm:w-[320px] group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                                tabIndex={0}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                role="button"
                                aria-label={`View ${item.title}`}
                            >
                                <Link href={`/blogs/${item.slug}`} className="block h-full">
                                    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-900 border border-gray-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 h-full">
                                        {/* Image Container */}
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}

                                                sizes="(max-width: 320px) 100vw, 320px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            // priority={index < 3}
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                                            {/* Tag Badge */}
                                            <div className="absolute top-4 left-4 flex items-center">
                                                <span className={`w-3 h-3 rounded-full ${item.color || 'bg-blue-500'} mr-2`}></span>
                                                <span className="px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-sm font-semibold text-white rounded-full border border-gray-700">
                                                    {item.metaInfo}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                            <p className="text-gray-400 mb-5 line-clamp-2">{item.description}</p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                                <div
                                                    className="text-purple-400 font-medium text-sm flex items-center transition-colors"
                                                    aria-label={`Read ${item.title}`}
                                                >
                                                    Read Article
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Dots Indicator */}
                    {showDots && (
                        <div className="flex justify-center space-x-2 mt-8">
                            {Array.from({ length: Math.max(1, displayItems.length - visibleItems + 1) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index
                                        ? 'bg-purple-600 w-8'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                    aria-current={currentIndex === index ? 'true' : 'false'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// Custom CSS for hiding scrollbar
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;


export default CategorySlider;