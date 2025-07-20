import React, { useEffect, useState } from 'react';
import { assets, projectsData } from '../assets/assets';
import { motion } from 'framer-motion';

const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardWidthCalc, setCardWidthCalc] = useState('100%'); // To hold dynamic width like 'calc(25% - 16px)'

    useEffect(() => {
        const updateCardLayout = () => {
            const gap = 32; // This corresponds to Tailwind's 'gap-8' (8 * 4 = 32px)
            if (window.innerWidth >= 1200) {
                // For 4 visible cards with peeking, each card is 1/4 of total width minus gaps,
                // but the overall visible area is more like 3.5 cards.
                // To get the 3.5 cards look where 3 are full and 2 halves are peeking
                // we need to make each card slightly less than 25% of the viewport width.
                // Let's assume you want 3 full cards and then equal peeks on both sides for the 4th/5th card
                // A common way to achieve this is 3.5 cards visible, so each card is 100/3.5 % wide.
                // Or if exactly 3 cards plus halves, it's 100 / (number_of_full_cards + 2*peek_fraction)
                // For the screenshot look: 4 cards visible, and enough space for gaps.
                // Let's target each card to be approx 25% of the available space
                // and use padding/margin to achieve the peek.

                // If you want 3.5 items, item width is 100 / 3.5 = ~28.57%
                // And total width of inner flex container would be (num_items * item_width) + (num_items-1 * gap)
                // Simpler: use calc for responsive width based on desired visible items
                setCardWidthCalc(`calc((100% - ${gap * 3}px) / 4)`); // 4 items, 3 gaps (8*4 = 32px per gap)
            } else if (window.innerWidth >= 1024) {
                setCardWidthCalc(`calc((100% - ${gap * 2}px) / 3)`); // 3 items, 2 gaps
            } else if (window.innerWidth >= 768) {
                setCardWidthCalc(`calc((100% - ${gap * 1}px) / 2)`); // 2 items, 1 gap
            } else {
                setCardWidthCalc(`calc(100% - ${gap * 0}px)`); // 1 item, 0 gaps (full width)
            }
        };

        updateCardLayout(); // Set initial value
        window.addEventListener('resize', updateCardLayout);

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', updateCardLayout);
    }, []);

    const nextProject = () => {
        setCurrentIndex((prevIndex) => {
            // We want to stop scrolling when the last item is in a similar "peek" position on the right
            // This is complex with dynamic peeking. A simpler loop is often best here.
            if (prevIndex === projectsData.length - 1) {
                return 0; // Loop back to the start
            }
            return prevIndex + 1; // Move to the next individual card
        });
    };

    const prevProject = () => {
        setCurrentIndex((prevIndex) => {
            // If at the beginning, loop to the end
            if (prevIndex === 0) {
                return projectsData.length - 1; // Go to the last item
            }
            return prevIndex - 1; // Move to the previous individual card
        });
    };

    return (
        <motion.div 
          initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        
        className='container mx-auto py-4 pt-20 px-6 md:px-20 lg:px-32 my-20 w-full overflow-hidden' id='Projects'>
            <h1 className='text-2xl sm:text-4xl font-bold mb-2 text-center'>Projects <span className='underline underline-offset-4 decoration-1 under font-light'>Completed</span></h1>
            <p className='text-center text-gray-500 mb-8 max-w-80 mx-auto'>Crafting Spaces, Building Legacies-Explore Our Portfolio</p>
            <div className='flex justify-end items-center mb-8'>
                <button
                    onClick={prevProject}
                    className='p-3 bg-gray-200 rounded mr-2'
                    aria-label='Previous Project'
                >
                    <img src={assets.left_arrow} alt="Previous" />
                </button>
                <button
                    onClick={nextProject}
                    className='p-3 bg-gray-200 rounded mr-2'
                    aria-label='Next Project'
                >
                    <img src={assets.right_arrow} alt="Next" />
                </button>
            </div>
            {/* Outer container for the visible window of the slider */}
            {/* Added horizontal padding to create the peek space */}
            <div className='overflow-hidden px-4 md:px-8 lg:px-16'> {/* Adjust these padding values as needed */}
                <div
                    className='flex transition-transform duration-500 ease-in-out'
                    // Apply negative margin-left to compensate for the initial padding on the outer div,
                    // and then apply transformX based on individual card width to create the scroll.
                    // The 'gap-8' is handled by the overall flex container and individual card width.
                    style={{
                        transform: `translateX(calc(-${currentIndex} * (${cardWidthCalc} + 32px)))`, // 32px is gap-8
                        // Adjust margin-left for the initial peek of the first item
                        // This counteracts the padding of the outer div to make cards align centrally
                        marginLeft: '-4px', // A small negative margin to fine-tune alignment with padding
                    }}
                >
                    {projectsData.map((project, index) => (
                        <div
                            key={index}
                            className={`relative flex-shrink-0`}
                            // Set width directly using inline style based on calculated percentage
                            style={{
                                width: cardWidthCalc,
                                // margin-right instead of padding-right to create the gap
                                marginRight: '32px' // Tailwind's gap-8 is 2rem = 32px
                            }}
                        >
                            <img src={project.image} alt={project.title} className='w-full h-auto mb-14' />
                            <div className='absolute left-0 right-0 bottom-5 flex justify-center'>
                                <div className='inline-block bg-white w-3/4 px-4 py-2 shadow-md'>
                                    <h2 className='text-xl font-semibold text-gray-800'>{project.title}</h2>
                                    <p className='text-gray-500 text-sm'>
                                        {project.price} <span className='px-1'>|</span> {project.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div 
        
        >
    );
};

export default Projects;