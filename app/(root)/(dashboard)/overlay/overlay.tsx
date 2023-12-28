"use client"

import {
    Button,
    Card,
    CardBody,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react"
import {FaLayerGroup, FaPlus} from "react-icons/fa"
import {useRef, useState} from "react"
import {createOverlay} from "@/app/(root)/(dashboard)/overlay/actions"
import {useRouter} from "next/navigation"
import NextLink from "next/link"

export function NewOverlay({count}) {
    const [loading, setLoading] = useState(false)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const {refresh} = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    function checkAndCreate() {
        const name = inputRef.current?.value

        if (!name) return

        setLoading(true)

        createOverlay(name).then(() => {
            onClose()
            refresh()
            setLoading(false)
        })
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        새로운 오버레이
                    </ModalHeader>
                    <ModalBody>
                        <Input ref={inputRef} placeholder="오버레이 이름을 입력해주세요"
                               labelPlacement="outside" value={`오버레이 ${count + 1}`}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={checkAndCreate} isLoading={loading}>
                            만들기
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Card className="flex flex-row items-center p-8" onClick={onOpen} isPressable>
                <CardBody className="flex flex-row items-center">
                    <FaPlus/>
                    <h1 className="text-xl font-bold ml-4">
                        새로운 오버레이 추가
                    </h1>
                </CardBody>
            </Card>
        </>
    )
}

export function Overlay({overlay}) {
    return (
        <NextLink href={`/overlay/${overlay.id}`}>
            <Card className="flex flex-row items-center p-8">
                <CardBody className="flex flex-row items-center text-2xl">
                    <FaLayerGroup/>
                    <h1 className="font-bold ml-4">
                        {overlay.name}
                    </h1>
                </CardBody>
            </Card>
        </NextLink>
    )
}