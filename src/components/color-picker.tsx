import {Button, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react"
import {HexAlphaColorPicker, HexColorInput, RgbaStringColorPicker} from "react-colorful"
import {useEffect, useState} from "react"
import {TbHash} from "react-icons/tb"
import {useDebounce} from "rooks"

export type ColorPickerProps = {
    color: string
    onChange: (color: string) => void
}

export default function ColorPicker({color, onChange}: ColorPickerProps) {
    const [selfColor, setSelfColor] = useState(color)

    const debounce = useDebounce(() => onChange(selfColor), 50)

    useEffect(() => debounce(), [selfColor])

    return (
        <Popover showArrow={true}>
            <PopoverTrigger>
                <Button variant="bordered" isIconOnly style={{backgroundColor: color}}/>
            </PopoverTrigger>
            <PopoverContent className="p-4">
                <HexAlphaColorPicker color={selfColor} onChange={setSelfColor}/>
                <div className="flex items-center gap-2 mt-4">
                    <TbHash/>
                    <HexColorInput className="px-4 py-2 rounded-xl bg-whitealpha-50"
                                   prefixed={false} alpha={true}
                                   color={selfColor} onChange={setSelfColor}/>
                </div>
            </PopoverContent>
        </Popover>
    )
}