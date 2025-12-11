"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const BINGO_CALLS = {
    1: "Partridge in a pear tree",
    2: "Two turtle doves",
    3: "Three wise men",
    4: "Four calling birds",
    5: "Five golden rings",
    6: "Six geese a-laying",
    7: "Seven swans a-swimming",
    8: "Eight maids a-milking",
    9: "Nine ladies dancing",
    10: "Ten lords a-leaping",
    11: "Eleven pipers piping",
    12: "Twelve drummers drumming",
    13: "Unlucky for some but Santa still comes",
    14: "Family routines",
    15: "Watching the King",
    16: "Nativity scene",
    17: "Movies streamed",
    18: "Santa’s been seen",
    19: "Dessert with cream",
    20: "Gifts aplenty",
    21: "Sleigh ride fun",
    22: "Two little reindeer",
    23: "Christmas Eve Eve",
    24: "Christmas Eve",
    25: "Christmas Day",
    26: "Boxing Day",
    27: "Snowfall heaven",
    28: "Pile your plate",
    29: "Bells that chime",
    30: "Santa’s getting flirty",
    31: "New Year’s Eve",
    32: "Gift wrap blues",
    33: "Lights on the tree",
    34: "Presents galore",
    35: "Starry skies",
    36: "Festive mix",
    37: "Bird in the oven",
    38: "Christmas cake",
    39: "Festive wine",
    40: "Nothing naughty",
    41: "Frosty fun",
    42: "An eggnog or two",
    43: "Merry Christmas to thee",
    44: "Just one more",
    45: "Christmas vibes",
    46: "Elf playing tricks",
    47: "Presents given",
    48: "Sticky tape",
    49: "It’s present time",
    50: "Don’t be thrifty",
    51: "Jokes and puns",
    52: "Santa’s footprints",
    53: "Down the chimney",
    54: "Knocking on the door",
    55: "Mince pies",
    56: "Candy sticks",
    57: "Holiday heaven",
    58: "Snowman’s mate",
    59: "Reindeer shine",
    60: "The elves are busy",
    61: "Snowfall has begun",
    62: "From me to you",
    63: "Christmas tree",
    64: "Festive décor",
    65: "Sleigh ride drive",
    66: "Favourite hits",
    67: "Wintery heaven",
    68: "Mince pies on a plate",
    69: "Snowfall divine",
    70: "Santa’s grotto",
    71: "Turkeys done",
    72: "Christmas brew",
    73: "Carols and glee",
    74: "Stockings on the floor",
    75: "Santa arrives",
    76: "Lego bricks",
    77: "Lucky sevens festive heaven",
    78: "Kids can’t wait",
    79: "Pantomime",
    80: "Santa’s plate",
    81: "Reindeer run",
    82: "Elves in view",
    83: "Tinsel on the tree",
    84: "Gifts and more",
    85: "Grandma’s arrived",
    86: "Mistletoe kiss",
    87: "In bed by 11",
    88: "Going for a skate",
    89: "Almost time",
    90: "A very full house",
};

// ❄️ Snowflake background
const Snow = () => {
    const [flakes, setFlakes] = useState([]);

    useEffect(() => {
        const totalFlakes = 50;
        const newFlakes = Array.from({ length: totalFlakes }, () => {
            const startX = Math.random() * 100;
            const drift = (Math.random() - 0.5) * 50;
            const duration = 8 + Math.random() * 10;
            const delay = Math.random() * 10;
            const size = 1 + Math.random() * 2;
            return { startX, drift, duration, delay, size };
        });
        setFlakes(newFlakes);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {flakes.map((flake, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -20, x: `${flake.startX}vw`, opacity: 0 }}
                    animate={{
                        y: "110vh",
                        x: [
                            `${flake.startX}vw`,
                            `${flake.startX + flake.drift}vw`,
                        ],
                        opacity: [0, 1, 0.7, 0],
                    }}
                    transition={{
                        duration: flake.duration,
                        delay: flake.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bg-white rounded-full blur-[1px] opacity-70"
                    style={{
                        width: flake.size * 2 + "px",
                        height: flake.size * 2 + "px",
                    }}
                />
            ))}
        </div>
    );
};

// 🎄 Shared Bingo Page
export default function ChristmasBingo() {
    const [calledNumbers, setCalledNumbers] = useState([]);
    const [currentNumber, setCurrentNumber] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [socket, setSocket] = useState(null);

    const searchParams = useSearchParams();
    const hidden = searchParams.get("hidden");

    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

    // Connect to WebSocket
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => console.log("Connected to WebSocket 🎅");
        ws.onclose = () => console.log("Disconnected from WebSocket 🧊");

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === "update") {
                    const { calledNumbers, currentNumber, isGameOver } =
                        msg.payload;
                    setCalledNumbers(calledNumbers);
                    setCurrentNumber(currentNumber);
                    setIsGameOver(isGameOver);
                }
            } catch (e) {
                console.error("Invalid message from server", e);
            }
        };

        setSocket(ws);
        return () => {
            ws.close();
        };
    }, []);

    const drawNumber = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "draw" }));
        }
    };

    const reset = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "reset" }));
        }
    };

    return (
        <main className="relative h-screen flex flex-col items-center justify-between bg-gradient-to-br from-[#1c0606] via-[#360101] to-red-950 text-white p-6 font-sans overflow-hidden">
            <Snow />

            {/* Header */}
            <div className="z-10 w-full flex justify-between items-start opacity-80">
                <span className="text-2xl">🎄</span>
                <h1 className="text-yellow-500/30 text-xs md:text-sm uppercase tracking-[0.3em] font-serif">
                    Diversity Group Bingo
                </h1>
                <span className="text-2xl">🎄</span>
            </div>

            {/* Main Display */}
            <div className="relative z-10 flex flex-col items-center flex-grow justify-center w-full">
                {isGameOver ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-sm mb-4">
                            Merry Christmas!
                        </h2>
                        <p className="text-red-200 text-xl font-serif italic">
                            Game Over
                        </p>
                    </motion.div>
                ) : currentNumber ? (
                    <div className="relative flex flex-col items-center justify-center">
                        <motion.div
                            key={currentNumber}
                            initial={{ y: -100, opacity: 0, rotate: -180 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                damping: 12,
                                stiffness: 100,
                            }}
                            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-green-500 via-green-700 to-green-950 shadow-[0_10px_40px_rgba(4,102,11,0.6)] flex items-center justify-center border-t border-green-400/50"
                        >
                            <div className="absolute top-4 left-6 w-12 h-8 bg-white/30 rounded-[100%] blur-[15px] rotate-[-45deg]" />
                            <div className="absolute -top-6 w-12 h-8 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 rounded-sm" />
                            <div className="absolute -top-10 w-4 h-6 border-2 border-yellow-400 rounded-t-full" />
                            <span className="text-8xl md:text-9xl font-extrabold text-white drop-shadow-md">
                                {currentNumber}
                            </span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={`text-${currentNumber}`}
                            className="mt-8 text-yellow-300 font-serif font-bold pt-3 text-2xl md:text-4xl text-center max-w-2xl drop-shadow-lg"
                        >
                            {BINGO_CALLS[currentNumber]}
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">☃️</div>
                        <p className="text-yellow-100/80 font-serif text-2xl italic">
                            Waiting for Santa to call...
                        </p>
                    </div>
                )}
            </div>

            {/* Board */}
            <div className="relative z-10 w-full flex flex-col gap-4 items-center justify-center pb-2 py-8">
                {calledNumbers.length > 0 && (
                    <div className="max-w-xl w-full">
                        <h3 className="text-center text-xs text-green-200/70 uppercase tracking-widest mb-3">
                            Previous Numbers
                        </h3>
                        <div className="flex justify-center h-16 gap-4">
                            <AnimatePresence mode="popLayout">
                                {calledNumbers
                                    .slice(-5)
                                    .reverse()
                                    .map((num) => (
                                        <motion.div
                                            key={num}
                                            initial={{
                                                opacity: 0,
                                                scale: 0,
                                                y: -20,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                            }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            className={`w-12 h-12 flex items-center justify-center text-lg font-bold rounded-full border border-white/20 shadow-lg relative ${
                                                num === currentNumber
                                                    ? "bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-700 text-white scale-110 shadow-[0_0_15px_rgba(234,179,8,0.8)] z-10 border border-white/50"
                                                    : "bg-gradient-to-br from-red-500 to-red-700"
                                            }`}
                                        >
                                            <div className="absolute top-1 left-2 w-3 h-2 bg-white/40 rounded-full blur-[1px] rotate-[-45deg]" />
                                            {num}
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                <div className="bg-green-950/40 backdrop-blur-sm rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-white/10 w-full max-w-6xl relative">
                    <div className="absolute -top-3 -left-3 text-2xl -rotate-[35deg]">
                        🔔
                    </div>
                    <div className="absolute -top-3 -right-3 text-2xl scale-x-[-1] rotate-[35deg]">
                        🔔
                    </div>

                    <div className="grid grid-cols-15 gap-[3px] md:gap-[5px] justify-items-center">
                        {allNumbers.map((num) => {
                            const isCalled = calledNumbers.includes(num);
                            const isLatest = num === currentNumber;
                            return (
                                <div
                                    key={num}
                                    className={`aspect-square w-full max-w-[30px] md:max-w-[36px] flex items-center justify-center text-[9px] md:text-sm font-bold rounded-full transition-all duration-500 relative ${
                                        isLatest
                                            ? "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 text-white scale-110 shadow-[0_0_15px_rgba(234,179,8,0.8)] z-10 border border-white/50"
                                            : isCalled
                                            ? "bg-gradient-to-br from-red-600 to-red-900 text-white shadow-inner opacity-90 border border-red-950"
                                            : "bg-slate-800/30 text-slate-500 border border-white/5"
                                    }`}
                                >
                                    {(isCalled || isLatest) && (
                                        <div className="absolute top-[15%] left-[20%] w-[30%] h-[20%] bg-white/40 rounded-full rotate-[-45deg] blur-[0.5px]" />
                                    )}
                                    {num}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div
                className={`relative z-20 flex gap-4 mb-4 ${
                    hidden === "true" && "hidden"
                }`}
            >
                <button
                    onClick={drawNumber}
                    disabled={isGameOver || !socket}
                    className="px-8 py-3 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white rounded-full font-bold shadow-[0_4px_0_rgb(127,29,29)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2 border border-red-400"
                >
                    <span>🎁</span> Call Next
                </button>

                <button
                    onClick={reset}
                    className="px-6 py-3 bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-full font-bold shadow-[0_4px_0_rgb(20,83,45)] active:shadow-none active:translate-y-1 transition-all border border-green-500"
                >
                    New Game
                </button>
            </div>
        </main>
    );
}
