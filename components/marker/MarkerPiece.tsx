"use client";

import {
  getMarkerPieceDisplayColour,
} from "@/lib/optifabric/marker/markerColourEngine";

import type {
  RenderedMarkerPiece,
} from "@/lib/optifabric/marker/markerRenderingEngine";

interface MarkerPieceProps {
  piece: RenderedMarkerPiece;

  selected?: boolean;

  showLabel?: boolean;

  showRotation?: boolean;

  onSelect?: (
    pieceId: string
  ) => void;
}

export default function MarkerPiece({
  piece,

  selected = false,

  showLabel = true,

  showRotation = true,

  onSelect,
}: MarkerPieceProps) {
  const colour =
    getMarkerPieceDisplayColour({
      pieceId:
        piece.sourcePieceId,

      selected,

      invalid:
        piece.outsideMarker,
    });

  const accessibleLabel = [
    piece.name,
    `instance ${piece.instanceNumber}`,
    `rotation ${piece.rotation} degrees`,
    piece.outsideMarker
      ? "outside marker boundary"
      : "inside marker boundary",
  ].join(", ");

  function handleKeyboard(
    event:
      React.KeyboardEvent<SVGGElement>
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      onSelect?.(
        piece.id
      );
    }
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={accessibleLabel}
      onClick={() =>
        onSelect?.(
          piece.id
        )
      }
      onKeyDown={
        handleKeyboard
      }
      className={
        onSelect
          ? "cursor-pointer outline-none"
          : undefined
      }
    >
      <polygon
        points={
          piece.polygonPointString
        }
        fill={colour.fill}
        stroke={colour.stroke}
        strokeWidth={
          selected ? 4 : 2
        }
        strokeDasharray={
          piece.outsideMarker
            ? "8 5"
            : undefined
        }
        vectorEffect="non-scaling-stroke"
      />

      {selected ? (
        <rect
          x={
            piece.boundingBox.minX -
            4
          }
          y={
            piece.boundingBox.minY -
            4
          }
          width={
            piece.boundingBox.width +
            8
          }
          height={
            piece.boundingBox.height +
            8
          }
          rx="5"
          fill="none"
          stroke={
            colour.stroke
          }
          strokeWidth="1.5"
          strokeDasharray="5 4"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      ) : null}

      {showLabel ? (
        <text
          x={piece.labelX}
          y={piece.labelY}
          fill={colour.text}
          fontSize="12"
          fontWeight="800"
          textAnchor="middle"
          dominantBaseline="middle"
          pointerEvents="none"
          vectorEffect="non-scaling-stroke"
        >
          {piece.name}
        </text>
      ) : null}

      {showRotation ? (
        <text
          x={piece.labelX}
          y={piece.labelY + 16}
          fill="rgb(148, 163, 184)"
          fontSize="10"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
          pointerEvents="none"
          vectorEffect="non-scaling-stroke"
        >
          #{piece.instanceNumber}
          {" · "}
          {piece.rotation}°
        </text>
      ) : null}

      {piece.outsideMarker ? (
        <text
          x={piece.labelX}
          y={piece.labelY + 32}
          fill="rgb(252, 165, 165)"
          fontSize="9"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="middle"
          pointerEvents="none"
          vectorEffect="non-scaling-stroke"
        >
          OUTSIDE MARKER
        </text>
      ) : null}
    </g>
  );
}