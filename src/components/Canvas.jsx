import React from 'react';

export const CanvasContext = React.createContext(null);

function Canvas(props) {

    const canvasRef = React.useRef(null);

    const [
        renderingContext,
        setRenderingContext,
    ] = React.useState(null);

    React.useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        setRenderingContext(context);
    }, []);

    const width = props.width;
    const height = props.height;

    return (
        <CanvasContext.Provider value={renderingContext}>
            <canvas width={width} height={height} ref={canvasRef} />
            {/* hexagons are passed through the `children` prop */}
            {props.children}
        </CanvasContext.Provider>
    );
}

export default Canvas;