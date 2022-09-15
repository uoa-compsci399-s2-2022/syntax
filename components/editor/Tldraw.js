import { TDShapeType, TDToolType, TDExport, TDExportType, Tldraw, TldrawApp } from '@tldraw/tldraw'
import * as React from 'react'
import { Modal, Button } from "@nextui-org/react"

const DrawingModal = ({ open, closeHandler, upload }) =>{
    const [app, setApp] = React.useState()

        const handleMount = React.useCallback((app) => {
            setApp(app)
        }, [])

    async function saveAndClose(){
        let svg = await app?.getSvg();
        if (typeof svg !== "undefined"){
            svg.setAttribute('xmls', 'http://www.w3.org/2000/svg')
            svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
            const svgBlob = new XMLSerializer().serializeToString(svg)
            const blob = new Blob([svgBlob], {type: "image/svg+xml;charset=utf-8"});
            svg = await upload(blob)
        }

        closeHandler(svg)
    }
    return (
        <Modal open={open} onClose={closeHandler} css={{ margin: "10px" }}>
            <Modal.Header>
                Drawing
            </Modal.Header>
            <Modal.Body>
                <div
                    style={{
                    position: 'relative',
                    width: '100%',
                    height: '500px',
                    overflow: 'hidden',
                    marginBottom: '32px',
                    }}
                    >
                        <Tldraw onMount={handleMount} showMenu={false} showPages={false} showMultiplayerMenu={false}/> 
                </div>
            </Modal.Body>
        
        <Modal.Footer>
            <Button onClick={saveAndClose}>Save and Close</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default DrawingModal