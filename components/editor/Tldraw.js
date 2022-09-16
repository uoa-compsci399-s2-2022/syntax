import { Tldraw } from '@tldraw/tldraw'
import { useState, useCallback } from 'react'
import { Modal, Button } from "@nextui-org/react"

const DrawingModal = ({ open, closeHandler }) =>{
    const [app, setApp] = useState()

        const handleMount = useCallback((app) => {
            setApp(app)
        }, [])

    async function saveAndClose(){
        let svg = await app?.getSvg();
        let blob = svg
        if (typeof svg !== "undefined"){
            svg.setAttribute('xmls', 'http://www.w3.org/2000/svg')
            svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
            const svgBlob = new XMLSerializer().serializeToString(svg)
            blob = new Blob([svgBlob], {type: "image/svg+xml;charset=utf-8"});
        }

        closeHandler(blob)
    }
    return (
        <Modal width open={open} onClose={closeHandler} css={{ 
            margin: "auto", 
            '@xs': "width: 100%", 
            '@sm': "width: 75%", 
            '@md': "width: 50%",
            '@lg': "width: 50%",
            display: 'flex'
            }}>
            <Modal.Header>
                <h3>Drawing</h3>
            </Modal.Header>
            <Modal.Body>
                <div
                    style={{
                    position: 'relative',
                    width: '100%',
                    height: '500px',
                    overflow: 'hidden',
                    }}
                    >
                        <Tldraw onMount={handleMount} showMenu={false} showPages={false} showMultiplayerMenu={false}/> 
                </div>
            </Modal.Body>
        
        <Modal.Footer>
            <Button onPress={() => saveAndClose()}>Save and Close</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default DrawingModal