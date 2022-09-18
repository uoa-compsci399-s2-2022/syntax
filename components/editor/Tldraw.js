import { Tldraw, TDExportType } from '@tldraw/tldraw'
import { useState, useCallback } from 'react'
import { Modal, Button } from "@nextui-org/react"

const DrawingModal = ({ open, closeHandler }) =>{
    const [app, setApp] = useState()
    const [width, setWidth] = useState("1%")

    const handleMount = useCallback((app) => {
        setApp(app)
        resetCursor()
    }, [])

    const resetCursor = () => {
        setWidth("1%")
        setTimeout(function() { //Start the timer
            setWidth("100%") //After 0.1 second
        }, 100)
    }

    async function saveAndClose(){
        app?.selectNone()
        const png = await app?.getImage(TDExportType.PNG);
        let content = await app?.getContent();
        if (typeof png !== "undefined"){
            closeHandler(png)
        } 
        const contentjson = JSON.stringify(content)
        const files = [png, contentjson]
        closeHandler(files)
    }
    return (
        <Modal noPadding width={width} open={open} onClose={closeHandler} onOpen={()=>resetCursor()}>
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