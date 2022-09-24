import { Tldraw, TDExportType } from '@tldraw/tldraw'
import { useState, useCallback } from 'react'
import { Modal, Button } from "@nextui-org/react"

const DrawingModal = ({ open, closeHandler, content }) =>{
    const [app, setApp] = useState()
    const [width, setWidth] = useState("1%")

    const handleMount = useCallback((app) => {
        setApp(app)
        openTldraw()
    }, [])

    const openTldraw = async () => {
        setWidth("1%")
        await app?.onReady()
        setTimeout(function() { //Start the timer
            setWidth("100%") //After 0.15 second
        }, 100)
        await app?.zoomToFit();
    }

    async function saveAndClose(){
        app?.selectNone()
        const png = await app?.getImage(TDExportType.PNG);
        let currentContent = await app?.document;
        if (content === currentContent){
            closeHandler(undefined)
        }else{
            const contentjson = JSON.stringify(currentContent)
            const files = [png, contentjson]
            closeHandler(files)
        }
        
    }
    return (
        <Modal noPadding width={width} open={open} onClose={closeHandler} onOpen={()=>openTldraw()}>
            <Modal.Body>
                <div className='tldraw'
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '500px',
                        overflow: 'hidden',
                    }}
                    >   {(content !== null)&& <Tldraw onMount={handleMount} showMenu={false} showPages={false} showMultiplayerMenu={false} document={content}/>}
                        {(content === null) && <Tldraw onMount={handleMount} showMenu={false} showPages={false} showMultiplayerMenu={false}/>}
                </div>
            </Modal.Body>
        
        <Modal.Footer>
            <Button onPress={() => saveAndClose()}>Save and Close</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default DrawingModal