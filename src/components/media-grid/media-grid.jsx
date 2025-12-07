"use client";

import React, { useMemo } from "react";
import classNames from "classnames";
import ImageVideoModal from "@/modal/image-video-modal/image-video-modal";
import Icon from "@/components/icon/icon";

function formatMediaLayout(items) {
    // Normalize picture -> image
    const normalizedItems = items.map(item => ({
        ...item,
    }));

    const images = normalizedItems.filter(i => i.category === "image");
    const videos = normalizedItems.filter(i => i.category === "video");

    const rows = [];
    let imageRowCount = 0;

    while (images.length > 0 || videos.length > 0) {
        // Insert up to 2 images per row
        if (images.length > 0) {
            const rowImages = images.splice(0, 2);

            // Decide col: 2 images → col:1 each, 1 image → col:2
            const col = rowImages.length === 2 ? 1 : 2;

            rows.push({
                type: "image",
                data: rowImages,
                col: col
            });

            imageRowCount += 1;

            // After 2 image rows, insert a video if available
            if (imageRowCount % 2 === 0 && videos.length > 0) {
                const video = videos.shift();
                rows.push({ type: "video", data: [video], col: 2 });
            }
        } else if (videos.length > 0) {
            // If no images left, add remaining videos
            const video = videos.shift();
            rows.push({ type: "video", data: [video], col: 2 });
        }
    }

    return rows;
}


const MediaGrid = ({ mediaItems, ...props }) => {
    const layoutRows = useMemo(() => formatMediaLayout(mediaItems), [mediaItems]);
    const [isModalOpen, setIsModalOpen] = React.useState({
        isVisible: false,
        src: "",
        type: "image",
    });
    console.log(layoutRows)
    return (
        <div className={classNames(props.className, "w-full grid grid-cols-1  gap-y-[12px] lg:gap-y-[16px] ")}>
            <ImageVideoModal
                config={isModalOpen}
                onClose={() => setIsModalOpen(prev => ({ ...prev, isVisible: false }))}
            />
            {
                layoutRows.map((row, rowIndex) => (
                    <div
                        className={classNames(
                            "w-full gap-x-[12px] gap-y-[12px] lg:gap-y-0  lg:gap-x-[16px]  grid",
                            row.col === 1 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                        )}
                        key={rowIndex}>
                        {row.data.map((item, itemIndex) => (
                            <React.Fragment
                                key={itemIndex}

                            >
                                {item.category === "image" ? (
                                    <div
                                        style={{
                                            backgroundImage: `url(${item.file_url})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            width: '100%',
                                        }}
                                        onClick={() => {
                                            setIsModalOpen({
                                                isVisible: true,
                                                src: item.file_url,
                                                title: item.title || "",
                                                description: item.description || "",
                                                type: "image",
                                            })
                                        }}
                                        className={classNames(props.imageItemClassName, "flex group cursor-pointer w-full h-[250px] lg:rounded-[10px] rounded-[8px] flex-col gap-[8px]")}>

                                        <div
                                            className={"w-full h-full lg:rounded-[10px] opacity-0  transition-all duration-300 ease-in-out group-hover:pointer-events-auto group-hover:opacity-100  rounded-[8px] hidden group-hover:flex flex-col justify-center items-center bg-[#530203B2]     "}>
                                            <Icon
                                                name={"camera-viewfinder.svg"}
                                                width={60}
                                                height={60}
                                            />
                                        </div>

                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            backgroundImage: `url(${item?.thumbnail})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            width: '100%',
                                        }}
                                        onClick={() => {
                                            setIsModalOpen({
                                                isVisible: true,
                                                src: item.file_url,
                                                title: item.title || "",
                                                description: item.description || "",
                                                type: "video",
                                            })
                                        }}
                                        className={classNames(props.videoItemClassName, "flex group cursor-pointer w-full  h-[350px] lg:rounded-[10px] rounded-[8px] flex-col gap-[8px]")}>

                                        <div
                                            className={"w-full h-full lg:rounded-[10px] p-[12px] lg:py-[30px] lg:px-[50px]    rounded-[8px] flex flex-col justify-end items-start bg-[#00000080]     "}>

                                            <div className={"flex flex-col gap-[24px]"}>
                                                <Icon
                                                    name={"play-circle.svg"}
                                                    width={50}
                                                    height={50}
                                                />

                                                <div className={"flex flex-col gap-[12px]"}>
                                                    <h3 className={"font-semibold line-clamp-1 text-[24px] text-white lg:text-[36px]"}>
                                                        {item.title}
                                                    </h3>
                                                    <p className={"text-white line-clamp-2 text-start typo-base-regular"}>
                                                        {item.description}
                                                    </p>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ))
            }
        </div>
    )
}

export default MediaGrid