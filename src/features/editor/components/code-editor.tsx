import { useEffect, useMemo, useRef } from "react" ;
import { EditorView , keymap } from "@codemirror/view";
import {oneDark} from "@codemirror/theme-one-dark" ; 
import { customTheme } from "../extentions/theme";
import { getLanguageExtension } from "../extentions/language-extension";
import {indentWithTab} from "@codemirror/commands" ; 
import { minimap } from "../extentions/minimap";
import {indentationMarkers} from "@replit/codemirror-indentation-markers" ; 
import { customSetup } from "../extentions/custom-setup";
import { suggestion } from "../extentions/suggestion";
import { quickEdit } from "../extentions/quick-edit";
import {selectionTooltip} from "../extentions/selection-tooltip" ; 

interface Props {
    fileName: string ;
    initialValue?: string ;
    onChange: (value: string) => void ;  
}

export const CodeEditor = ({
    fileName , initialValue = "", onChange
} : Props) => {
    const editorRef = useRef<HTMLDivElement>(null) ;
    const viewRef = useRef<EditorView | null>(null) ;

    const languageExtension = useMemo(() => {
        return getLanguageExtension(fileName)
    }, [fileName])

    useEffect(() => {
        if(!editorRef.current) return ; 

        const view = new EditorView({
            doc: initialValue ,
            parent: editorRef.current , 
            extensions: [
                customSetup , 
                customTheme,
                oneDark,
                languageExtension,
                suggestion(fileName),
                quickEdit(fileName),
                selectionTooltip(),
                keymap.of([indentWithTab]),
                minimap(),
                indentationMarkers() ,
                EditorView.updateListener.of((update) => {
                    if(update.docChanged) {
                        onChange(update.state.doc.toString()) ;
                    }
                })
            ],  
        });

        viewRef.current = view ; 

        return () => {
            view.destroy() ; 
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [languageExtension]) ;

    return(
        <div ref={editorRef} className="size-full pl-4 bg-background" />
            
    )
}