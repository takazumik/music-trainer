import React, { useEffect, useState } from "react";

interface KeyProps {
  note: string;
  isBlack: boolean;
  isPressed: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  isHinted: boolean;
  showNoteName: boolean;
  onClick: () => void;
  onRelease: () => void;
  position?: { left: string };
}

export const Key: React.FC<KeyProps> = ({
  note,
  isBlack,
  isPressed,
  isCorrect,
  isIncorrect,
  isHinted,
  showNoteName,
  onClick,
  onRelease,
  position,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (isCorrect || isIncorrect) {
      setShowFeedback(true);
      // 300ms後にフィードバックを消す（仕様書準拠）
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, isIncorrect]);

  const noteDisplay = note.replace(/\d+$/, ""); // オクターブ番号を除去

  const baseClasses = `
    transition-all duration-100 cursor-pointer select-none
    rounded-b-md shadow-md hover:shadow-lg
    ${isBlack ? "absolute z-20" : "relative z-10"}
  `;

  const sizeClasses = isBlack ? "w-8 h-32" : "w-12 h-48 border border-gray-300";

  const colorClasses = (() => {
    if (showFeedback && isCorrect) {
      return isBlack ? "bg-green-600" : "bg-green-400";
    }
    if (showFeedback && isIncorrect) {
      return isBlack ? "bg-red-600" : "bg-red-400";
    }
    if (isPressed) {
      return isBlack ? "bg-gray-700" : "bg-gray-300";
    }
    if (isHinted) {
      return isBlack ? "bg-blue-700" : "bg-blue-200";
    }
    return isBlack
      ? "bg-gray-900 hover:bg-gray-800"
      : "bg-white hover:bg-gray-50";
  })();

  const textColorClasses = isBlack ? "text-white" : "text-gray-700";

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${colorClasses}`}
      style={position}
      onMouseDown={onClick}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      onTouchStart={onClick}
      onTouchEnd={onRelease}
    >
      {showNoteName && (
        <span
          className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold ${textColorClasses}`}
        >
          {noteDisplay}
        </span>
      )}
    </button>
  );
};
