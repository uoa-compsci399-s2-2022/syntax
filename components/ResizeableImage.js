import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'

export default (props) => {
    const handler = (mouseDownEvent) => {
        const parent = (mouseDownEvent.target).closest('.image-resizer')
        const image = parent?.querySelector('img.postimage') ?? null
        if(image===null)
            return
        const startSize = { x: image.clientWidth, y: image.clientHeight }
        const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY }

        function onMouseMove(mouseMoveEvent) {
            props.updateAttributes({
                width: startSize.x - startPosition.x + mouseMoveEvent.pageX,
                height: startSize.y - startPosition.y + mouseMoveEvent.pageY
            })
        }
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });
    };
    return (
        <NodeViewWrapper className="image-resizer">
            {props.extension.options.useFigure? (
                <figure>
                    <img {...props.node.attrs} className='postimage' />
                </figure>
            ) : (<img {...props.node.attrs} className='postimage' />)}
            <div className='resize-trigger' onMouseDown={handler}>
                {<>⊙</>}
            </div>
        </NodeViewWrapper>
    )
}