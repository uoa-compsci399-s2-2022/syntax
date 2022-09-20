// import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language"
import { clike } from "@codemirror/legacy-modes/mode/clike"
import { useEffect, useState, useRef } from "react";
import { useTheme, Button, Spacer, Dropdown } from "@nextui-org/react";
import {
    NodeViewWrapper
} from "@tiptap/react";
import { TIO, LANGUAGES as TioLanguages } from '@/node/tio';

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

    const run = async(event) => {
        const compiled = await TIO.run(doc, input, lang);
        updateAttributes({ code_output: compiled[0] })
        console.log(compiled);
    };

    useEffect(() => {
        let isDark = type === "dark" ? true : false;
        const view = new EditorView({
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
                EditorView.theme({}, { dark: isDark })
            ],
            parent: refEditor.current,
        });
        return () => {
            view.destroy();
        };
    }, [type]);

    return ( <
        NodeViewWrapper >
        <
        div className = "maindiv" >

        <
        Dropdown >
        <
        Dropdown.Button light css = {
            { tt: 'capitalize' }
        } > { lang } < /Dropdown.Button> <
        Dropdown.Menu items = { TioLanguages }
        onAction = {
            (key) => {
                updateAttributes({ language: TioLanguages[key] });
            }
        } > {
            TioLanguages.map((lang, index) => ( <
                Dropdown.Item key = { index }
                value = { lang } > { lang } <
                /Dropdown.Item>
            ))
        } <
        /Dropdown.Menu> < /
        Dropdown >

        <
        refEditor ref = { refEditor }
        />  <
        Spacer y = { 0.5 }
        /> <
        Button bordered responsive auto ghost size = 'xs'
        onClick = {
            () => run()
        } > Run Code < /Button> <
        div className = "output" >
        <
        span > { result } < /span> < /
        div > <
        /div> 


        <
        /
        NodeViewWrapper >
    );
};