import { Tag } from "antd";
import Table from "../../../../components/common/Table/Table";
import type {
    TCourseContent,
    TExamAttempt,
    TTableData,
    TTableHeadingData,
} from "../../../../types";
import timeDiffInMin from "../../../../utils/timeDiffInMin";
import { Link, type SetURLSearchParams } from "react-router-dom";

type TCQResultProps = {
    exam: TCourseContent;
    loading: boolean;
    attempts: TExamAttempt[];
    searchParams: URLSearchParams;
    setSearchParams: SetURLSearchParams;
};

const CQResult = ({
    exam,
    loading,
    attempts,
    searchParams,
    setSearchParams,
}: TCQResultProps) => {
    const tableHeadingData: TTableHeadingData = [
        "Name",
        "Rank",
        "Mark",
        "Status",
        "Provide Ans",
        "Duration",
        "Action",
    ];
    const tableData: TTableData = [];
    attempts.forEach((item: TExamAttempt, index: number) =>
        tableData.push([
            item.student.name,
            String(index + 1),
            item.obtainedMarks || "N/A",
            !item?.isChecked ? (
                <Tag color="gold">Not checked yet!</Tag>
            ) : item?.isPassed ? (
                <Tag color="green">Pass</Tag>
            ) : (
                <Tag color="volcano">Fail</Tag>
            ),
            String(item.answers?.length || 0),
            timeDiffInMin(item.submitTime, item.startTime) + "min",
            <Link to={`/result/${exam.id}/student/${item.student.id}/review`}>
                View
            </Link>,
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

export default CQResult;
