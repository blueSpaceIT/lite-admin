import { Tag } from "antd";
import Table from "../../../../components/common/Table/Table";
import type {
    TCourseContent,
    TExamAttempt,
    TTableData,
    TTableHeadingData,
} from "../../../../types";
import timeDiffInMin from "../../../../utils/timeDiffInMin";
import type { SetURLSearchParams } from "react-router-dom";

type TMCQResultProps = {
    exam: TCourseContent;
    loading: boolean;
    attempts: TExamAttempt[];
    searchParams: URLSearchParams;
    setSearchParams: SetURLSearchParams;
};

const MCQResult = ({
    exam,
    loading,
    attempts,
    searchParams,
    setSearchParams,
}: TMCQResultProps) => {
    const tableHeadingData: TTableHeadingData = [
        "Name",
        "Rank",
        "Mark",
        "Status",
        "Provide Ans",
        "Right Ans",
        "Wrong Ans",
        "Duration",
    ];
    const tableData: TTableData = [];
    attempts.forEach((item: TExamAttempt, index: number) =>
        tableData.push([
            item.student.name,
            String(index + 1),
            item.obtainedMarks,
            item?.isPassed ? (
                <Tag color="green">Pass</Tag>
            ) : (
                <Tag color="volcano">Fail</Tag>
            ),
            String((Number(item?.right) || 0) + (Number(item?.wrong) || 0)),
            String(item?.right),
            String(item?.wrong),
            timeDiffInMin(item.submitTime, item.startTime) + "min",
        ])
    );

    return (
        <div>
            <Table
                title={`Result - ${exam.content.exam?.title}`}
                headingData={tableHeadingData}
                data={tableData}
                loading={loading}
                meta={{
                    limit: tableData.length,
                    page: 1,
                    totalPage: 1,
                    totalDoc: tableData.length,
                }}
                path={`/result/${exam.id}`}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                assets={false}
            />
        </div>
    );
};

export default MCQResult;
