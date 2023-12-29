"use client"

import {useEffect, useState} from "react"
import {useLocalstorageState} from "rooks"
import {
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    Select,
    SelectItem,
    Slider,
    Switch,
    Tooltip
} from "@nextui-org/react"
import {ChatBoxConfig, fontFaces} from "@/app/o/config"
import {Editor} from "@monaco-editor/react"
import {FaArrowLeft, FaCopy, FaLayerGroup, FaSave} from "react-icons/fa"
import {toast} from "sonner"
import NextLink from "next/link"
import {RxReset} from "react-icons/rx"
import {useRouter} from "next/navigation"
import {saveChatBoxConfig} from "@/app/(root)/(dashboard)/overlay/[id]/actions"
import {platformNames} from "@/utils/platforms"
import {cn} from "@/utils/cn"
import ColorPicker from "@/components/color-picker"
import {SiObsstudio} from "react-icons/si"

function ConfigPlatform({platform, property, overlay, config, setConfig}) {
    const disabled = !overlay.user[platform]

    return (
        <div className="flex items-center gap-2">
            <Tooltip content="채널 연결이 필요합니다" isDisabled={!disabled} showArrow>
                <div>
                    <Checkbox isSelected={config[property]} onValueChange={value => setConfig({
                        ...config,
                        [property]: value
                    })} isDisabled={disabled}/>
                </div>
            </Tooltip>
            <img alt="" src={`/assets/${platform}.svg`} className="size-8"/>
            <p>
                {platformNames[platform]}
            </p>
        </div>
    )
}

function ConfigSwitch({label, property, platform = null, config, setConfig, className = "", ...props}) {
    return (
        <div className={cn("flex items-center gap-2", className)} {...props}>
            <Switch isSelected={config[property]} onValueChange={value => setConfig({
                ...config,
                [property]: value
            })} size="sm"/>
            {platform && (
                <img alt="" src={`/assets/${platform}.svg`} className="size-4"/>
            )}
            <h2 className="text-md">
                {label}
            </h2>
        </div>
    )
}

export function ChatBoxConfig({overlay}) {
    const [config, setConfig] = useLocalstorageState<ChatBoxConfig>("chat-config", overlay.config)
    const [availableFonts, setAvailableFonts] = useState(null)
    const {refresh} = useRouter()

    const isChanged = JSON.stringify(config) !== JSON.stringify(overlay.config)
    const overlayLink = `https://overlayz.kr/o/${overlay.id}`

    function copy() {
        navigator.clipboard.writeText(overlayLink).then()
        toast.success("클립보드에 복사되었습니다.")
    }

    function save() {
        saveChatBoxConfig(overlay.id, config).then(() => {
            refresh()
            toast.success("저장되었습니다.")
        })
    }

    useEffect(() => {
        setConfig(overlay.config)
    }, [overlay])

    useEffect(() => {
        document.fonts.ready.then(() => {
            const fonts = [...document.fonts].map(fontFace => fontFace.family)
            const available = fontFaces.filter(fontFace => fonts.includes(fontFace.value))
            setAvailableFonts(available)
        })
    }, [])

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center text-4xl gap-4">
                <Button as={NextLink} href="/overlay"
                        className="size-20" startContent={<FaArrowLeft/>} variant="light" isIconOnly/>
                <FaLayerGroup/>
                <h1 className="font-bold ml-4">
                    {overlay.name}
                </h1>
                <div className="flex-1"/>
                <Button variant="solid" size="lg" isDisabled={!isChanged}
                        startContent={<RxReset/>} onClick={() => setConfig(overlay.config)}>
                    되돌리기
                </Button>
                <Button color={isChanged ? "primary" : "default"} variant="solid" size="lg"
                        isDisabled={!isChanged} startContent={<FaSave/>} onClick={save}>
                    저장하기
                </Button>
            </div>
            <div className="rounded-2xl bg-whitealpha-50 overflow-hidden">
                <div className="flex gap-2 items-center bg-whitealpha-50 shadow-xl py-4 px-8 font-bold">
                    <SiObsstudio className="mr-4" size={30}/>
                    <Button size="sm" variant="flat" className="w-full text-md font-bold"
                            onClick={copy} disableAnimation>
                        {overlayLink}
                    </Button>
                    <Button size="sm" variant="flat" endContent={<FaCopy/>} isIconOnly onClick={copy}/>
                </div>
                <iframe id="chat-test" src={"/o/test/chat"} style={{colorScheme: "normal"}}
                        className="bg-transparent w-full h-[250px]"/>
            </div>
            <div className="flex gap-4">
                <div className="w-full flex flex-col gap-3">
                    <h2 className="text-2xl text-whitealpha-600">
                        CSS
                    </h2>
                    <Divider/>
                    <div className="rounded-lg overflow-hidden">
                        <Editor
                            language="css"
                            value={config.css}
                            onChange={css => setConfig({...config, css})}
                            loading={(
                                <div className="flex justify-center items-center">
                                    <CircularProgress/>
                                </div>
                            )}
                            theme="vs-dark"
                            options={{
                                minimap: {enabled: false},
                                padding: {top: 24},
                                fontSize: 12,
                                tabSize: 2,
                                fontLigatures: true,
                                cursorSmoothCaretAnimation: "on",
                                automaticLayout: true,
                                renderValidationDecorations: "off"
                            }}
                            height="70vh"
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl text-whitealpha-600">
                            플랫폼 설정
                        </h2>
                        <Divider/>
                        <div className="grid grid-cols-2 gap-4z">
                            <ConfigPlatform platform="chzzk" property="showChzzk"
                                            overlay={overlay} config={config} setConfig={setConfig}/>
                            <ConfigPlatform platform="twitch" property="showTwitch"
                                            overlay={overlay} config={config} setConfig={setConfig}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl text-whitealpha-600">
                            스타일 설정
                        </h2>
                        <Divider/>
                        <div className="flex gap-2">
                            {availableFonts ? (
                                <Select items={availableFonts} size="sm" className="w-48"
                                        value={config.fontFace} onSelectionChange={value => {
                                    setConfig({...config, fontFace: [...value][0].toString()})
                                }} renderValue={([item]) => (
                                    <div key={item?.key} style={{fontFamily: item?.key?.toString()}}>
                                        {item?.rendered}
                                    </div>
                                )} selectedKeys={[config.fontFace]} disallowEmptySelection>
                                    {(font: any) => (
                                        <SelectItem key={font.value} value={font.value}
                                                    className="py-2 text-3xl"
                                                    style={{fontFamily: font.value}}>
                                            {font.name}
                                        </SelectItem>
                                    )}
                                </Select>
                            ) : (
                                <div className="max-w-xs">
                                    <CircularProgress/>
                                </div>
                            )}
                            <div className="flex-1"/>
                            <div className="flex flex-row gap-2">
                                <p className="text-sm">
                                    배경색
                                </p>
                                <ColorPicker color={config.backgroundColor}
                                             onChange={backgroundColor => setConfig({...config, backgroundColor})}/>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="text-sm">
                                    글씨색
                                </p>
                                <ColorPicker color={config.textColor}
                                             onChange={textColor => setConfig({...config, textColor})}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-full flex flex-row items-center gap-4">
                                <p className="text-sm w-32">
                                    폰트 크기
                                </p>
                                <Slider size="sm" maxValue={100} minValue={12} defaultValue={config.fontSize}
                                        className="w-full" key={isChanged.toString()}
                                        onChangeEnd={(fontSize: number) => setConfig({
                                            ...config, fontSize
                                        })}/>
                                <p className="text-sm w-16 text-whitealpha-500">
                                    {config.fontSize}px
                                </p>
                            </div>
                            <div className="w-full flex flex-row items-center gap-4">
                                <p className="text-sm w-32">
                                    채팅 표시 시간
                                </p>
                                <Slider size="sm" maxValue={300} minValue={0} defaultValue={config.messageHideDelay}
                                        className="w-full" key={isChanged.toString()}
                                        onChangeEnd={(messageHideDelay: number) => setConfig({
                                            ...config, messageHideDelay
                                        })}/>
                                <p className="text-sm w-16 text-whitealpha-500">
                                    {config.messageHideDelay === 0 ? "항상" : `${config.messageHideDelay}초`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl text-whitealpha-600">
                            표시 설정
                        </h2>
                        <Divider/>
                        <div className="grid grid-cols-2 gap-4">
                            <ConfigSwitch label="배지 표시" property="showBadge"
                                          config={config} setConfig={setConfig}/>
                            <ConfigSwitch label="플랫폼 표시" property="showPlatform"
                                          config={config} setConfig={setConfig}/>
                            <ConfigSwitch label="이름 표시" property="showName"
                                          config={config} setConfig={setConfig}/>
                            <ConfigSwitch label="콜론 (:) 표시" property="showColon"
                                          config={config} setConfig={setConfig}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl text-whitealpha-600">
                            기타 설정
                        </h2>
                        <Divider/>
                        <div className="grid grid-cols-2 gap-4">
                            <ConfigSwitch label="새로고침 시 최근 채팅 불러오기" property="showRecentChat"
                                          className="col-span-2" platform="chzzk"
                                          config={config} setConfig={setConfig}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}