export type TSlider = {
    _id: string;
    id: string;
    images: TSliderGallery[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type TSliderGallery = {
    _id: string;
    id: string;
    url: string;
    destination: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
