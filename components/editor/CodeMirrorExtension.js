// import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language"
import { clike } from "@codemirror/legacy-modes/mode/clike"
import { useEffect, useState, useRef } from "react";
import { useTheme, Button, Spacer, Dropdown, Card } from "@nextui-org/react";
import {
    NodeViewWrapper
} from "@tiptap/react";
import { TIO, LANGUAGES as TioLanguages } from '@/node/tio';

import { EditorState } from '@codemirror/state';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { oneDarkTheme, oneDarkHighlightStyle } from "@codemirror/theme-one-dark";

const themeExtensions = {
    light: [githubLight],
    dark: [ githubDark /**oneDarkTheme, oneDarkHighlightStyle (are supposed to be here)*/]
}

export const Extension = ({
    node: {
        attrs: { language: lang, code_content: doc, code_output: result },
    },
    updateAttributes,
    extension,
}) => {
    const refEditor = useRef(null);
    const [language, setLanguage] = useState();
    const [input, setInput] = useState([]);
    const [code, setCode] = useState();
    const [output, setOutput] = useState(result);
    const { checked, type } = useTheme();
    

    let isDark = type === "dark" ? true : false;
    const [theme, setTheme] = useState('dark');

    const langDict = {
        'c-clang': 'C',
        'cpp-clang': 'C++',
        'java-jdk': 'Java',
        'javascript-node': 'JavaScript',
        'python3': 'Python'
    }

    const run = async(event) => {
        const compiled = await TIO.run(doc, input, lang);
        updateAttributes({ code_output: compiled[0] })
        console.log(compiled);
    };

    useEffect(() => {
        const state = EditorState.create({
            doc,
            extensions: [
                basicSetup,
                keymap.of([indentWithTab]),
                javascript(),
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        updateAttributes({ code_content: v.state.doc.toString() });
                    }
                }),
                EditorView.theme({}, { dark: isDark }),
                ...themeExtensions[isDark ? 'dark' : 'light'],
            ],
        })
        const view = new EditorView({
            state,
            
            parent: refEditor.current,
        });
        return () => {
            view.destroy();
        };
    }, [type, theme]);

    return ( <NodeViewWrapper>

        <Card variant='bordered' css={{$$cardColor: 'rgba(255,255,255,0.0)'}}>
        <Card.Body>
        <div className = "maindiv" >
        <Dropdown>
        <Dropdown.Button light css = {
            { tt: 'capitalize' }
        } > { langDict[lang] } </Dropdown.Button>  
        <Dropdown.Menu items = { TioLanguages }
        onAction = {
            (key) => {
                updateAttributes({ language: TioLanguages[key] });
            }
        } > {
            TioLanguages.map((lang, index) => ( 
                <Dropdown.Item key = { index }
                value = { lang } > { langDict[lang] } </Dropdown.Item>
            ))
            }</Dropdown.Menu> 
        </Dropdown >

        <refEditor ref = { refEditor }/>   
        <Spacer y = { 0.5 }/>  
        <Button bordered responsive auto ghost size = 'xs'
        onClick = {
            () => run()
        } > Run Code </Button> 

        <Spacer y ={ 0.5 }/>
        <div className = "output" >
        <span> { result } </span>  
        </div> 
        </div>
        </Card.Body>
        </Card>

        </NodeViewWrapper >
    );
};