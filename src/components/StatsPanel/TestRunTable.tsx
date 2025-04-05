import {
	Button,
	ButtonGroup,
	IconButton,
	Pagination,
	Table,
	VStack,
} from "@chakra-ui/react";
import { startCase } from "lodash";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useAppContext } from "../../context/AppContext";

const columnKeys = [
	"pathDistance",
	"pathDistanceRatio",
	"pathSegments",
	"percentGraphExplored",
	"totalTime",
] as const;

export default function TestRunTable() {
	const { testRuns, setAppValues } = useAppContext();
	const [page, setPage] = useState(1);
	const visibleTestRun = useMemo(() => testRuns?.[page - 1], [page, testRuns]);
	const pathStatsMapEntries = useMemo(
		() => Object.entries(visibleTestRun?.pathStatsMap || {}),
		[visibleTestRun],
	);

	return (
		<VStack gap={4}>
			<Table.Root variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Algorithm</Table.ColumnHeader>
						{columnKeys.map((columnKey) => (
							<Table.ColumnHeader key={columnKey}>
								{startCase(columnKey)}
							</Table.ColumnHeader>
						))}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{pathStatsMapEntries.map(([key, pathStats]) => (
						<Table.Row key={`${key}`}>
							<Table.Cell>
								<Button
									variant="outline"
									size="xs"
									onClick={() =>
										setAppValues({
											...visibleTestRun?.appValues,
											path: pathStats?.path,
										})
									}
								>
									{startCase(key)}
								</Button>
							</Table.Cell>
							{columnKeys.map((columnKey) => (
								<Table.Cell key={columnKey}>
									{pathStats?.[columnKey] ?? "—"}
								</Table.Cell>
							))}
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>

			<Pagination.Root
				count={testRuns?.length}
				pageSize={1}
				page={page}
				onPageChange={(e) => setPage(e.page)}
			>
				<ButtonGroup variant="ghost" size="sm">
					<Pagination.PrevTrigger asChild>
						<IconButton>
							<HiChevronLeft />
						</IconButton>
					</Pagination.PrevTrigger>

					<Pagination.Items
						render={(page) => (
							<IconButton variant={{ base: "ghost", _selected: "outline" }}>
								{page.value}
							</IconButton>
						)}
					/>

					<Pagination.NextTrigger asChild>
						<IconButton>
							<HiChevronRight />
						</IconButton>
					</Pagination.NextTrigger>
				</ButtonGroup>
			</Pagination.Root>
		</VStack>
	);
}
