const timeDiffInMin = (startDate: Date, endDate: Date) => {
    const timeDiff = Math.round(
        (new Date(startDate).getTime() - new Date(endDate).getTime()) /
            (1000 * 60)
    );

    return timeDiff;
};

export default timeDiffInMin;
