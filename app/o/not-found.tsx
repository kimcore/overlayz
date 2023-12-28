"use client"

export default function NotFound() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
        }}>
            <h2>Not Found</h2>
            <p>
                해당 링크에 해당하는 오버레이를 찾을 수 없어요.<br/>
                링크를 다시 한번 확인해주세요.
            </p>
        </div>
    )
}