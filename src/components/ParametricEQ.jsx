import { CanvasContext } from './Canvas';
import { clamped, linearScale, logarithmicScale, uiConverter } from '../scales/scales';
import * as eqtils from './eqtils';
import { useDragXY, useMouseDown } from './gestureHandler';
import { useContext, useRef } from 'react';
import * as uuid from 'uuid';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEQ(props) {

    const canvasContext = useContext(CanvasContext);
    const id = useRef(uuid.v4());

    const eq = { ...props.eq };
    const onInput = props.onInput;
    const x = props.x || 0;
    const y = props.y || 0;
    const width = props.width || 900;
    const height = props.height || 300;
    const minimal = props.minimal;

    const xMin = x;
    const xMax = xMin + width;
    const yMin = y;
    const yMax = yMin + height;

    const frequencyScale = clamped(logarithmicScale(eq.minFreq, eq.maxFreq));
    const gainScale = clamped(linearScale(eq.minGain, eq.maxGain));
    const xScale = linearScale(xMin, xMax);
    const yScale = linearScale(yMin, yMax, true);

    const xConverter = uiConverter(frequencyScale, xScale);
    const yConverter = uiConverter(gainScale, yScale);

    const activeBand = eq.activeBand;
    const freq = eq.bands[activeBand]?.frequency || eq.minFreq;
    const gain = eq.bands[activeBand]?.gain || eq.minGain;
    const bounds = { xMin, yMin, xMax, yMax };

    const onMouseDown = (x, y) => {
        const band = eqtils.findClosestBand(eq, x, y, xMin, xMax, yMin, yMax);
        eq.activeBand = band;
        onInput(eq);
    };
    useMouseDown(id.current, canvasContext.canvasRef, onMouseDown, bounds);

    const onDrag = (newFrequency, newGain) => {
        eq.bands[eq.activeBand].frequency = newFrequency;
        eq.bands[eq.activeBand].gain = newGain;
        onInput(eq);
    };
    useDragXY(id.current, canvasContext.canvasRef, [freq, gain], onDrag, [xConverter, yConverter], bounds);

    if (canvasContext.context) {
        const ctx = canvasContext.context;
        const style = { background, bandStroke, sumStroke };
        eqtils.renderEq(eq, ctx, x, y, width, height, minimal, style);
    }

    return null;
}

export default ParametricEQ;
