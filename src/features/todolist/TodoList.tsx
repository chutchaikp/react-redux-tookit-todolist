import { CheckCircleIcon } from '@chakra-ui/icons';
import { Badge, Box, Button, Checkbox, CloseButton, Flex, FormControl, HStack, Input, useToast, VStack } from '@chakra-ui/react';
import { formatDistance } from 'date-fns';
import React, { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { allTodo, add, setFinish, setSelect, remove, } from './todoListSliceV2'

const TodoList = () => {
	const todolist = useAppSelector(allTodo);
	const dispatch = useAppDispatch();

	console.log(todolist)

	const toast = useToast()
	const iRef = useRef<any>({})
	const [invalidFields, setInvalidFields] = useState<any>({
		title: false,
	})

	const validateInvalid = (e: any) => {
		const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		const frm = e.target;
		let invalid = { ...invalidFields };

		invalid = {
			...invalid, title: (frm.title.value.length > 0 ||
				frm.title.value.length > 20 ||
				format.test(frm.title.value)
				? false : true)
		}

		// Validate length > 20 chars    
		if (frm.title.value.length > 20) {
			showToast('Exceeding the maximum allowable length', 'error')
			return true;
		}
		// Validate spectial charater    
		if (format.test(frm.title.value)) {
			showToast('Special characters not allowed', 'error')
			return true;
		}

		setInvalidFields(invalid)

		const keys = Object.keys(invalid);
		const found = keys.some((s: string) => {
			return invalid[s] === true;
		});
		return found;
	}

	const formSubmit = async (e: any) => {
		e.preventDefault();

		if (validateInvalid(e)) {
			// invalid found
		} else {
			dispatch(add({ title: iRef.current['title'].value }))

			iRef.current['title'].value = '';
		}
	}

	const showToast = (msg: string, status: string = 'success') => {
		toast({
			title: msg,
			status: 'success',
			position: 'top-right',
			isClosable: true,
			render: () => (
				<Flex direction="row"
					color="white"
					p="5px" bg={status === 'success' ? 'green.500' : 'red'} rounded="md" alignItems="center" >
					<CheckCircleIcon mx="5px" fontSize="18px" />
					<p style={{ color: 'white', marginLeft: '5px', fontSize: '18px' }}>{msg}</p>
				</Flex>
			)
		})
	}

	return (
		<Flex align="center" direction="column"  >

			{/* <Alert >
				<AlertIcon />
				<AlertTitle fontSize="xs" mr={2}>
					Demonstration
				</AlertTitle>
				<AlertDescription fontSize="xs">
					Tech stacks - React with Redux tookit
				</AlertDescription>
				<CloseButton position="absolute" right="8px" top="8px" />
			</Alert> */}

			<VStack mt="2rem" spacing={5} w={{ base: "50%", sm: "90%", md: "50%" }}  >

				<form onSubmit={formSubmit} style={{ width: '99%', }} >

					<FormControl isInvalid={invalidFields.title}>
						<label>
							<HStack align="center" >
								<Input name="title" size="md" rounded="none" placeholder="Enter todo here" defaultValue="" ref={el => iRef.current['title'] = el} />
								<div style={{ display: "flex", justifyContent: "center", marginLeft: "0", }}>
									<Button rounded="none" size="md" variant="outline" type="submit" >save</Button>
								</div>
							</HStack>
						</label>
					</FormControl>

				</form>

				<Box boxShadow="lg" px="6" pb="4" rounded="md" bg="white" width="100%">
					<ul style={{ width: '100%', }}>
						<li> total {todolist.length}</li>
						<li>
							<Flex direction="row" justify="space-between" height="2.2rem" align="center" >

								{todolist.length > 0 && (
									<Checkbox size="lg" onChange={(e) => {
										e.preventDefault();
										const isChecked = e.target.checked
										dispatch(setSelect({ id: "-1", selected: isChecked, }))
									}} >
										<span>Select all</span>
									</Checkbox>
								)}

								{todolist.some((x: any) => x.selected) && (
									<HStack>
										<Button size="sm" onClick={() => {
											dispatch(remove({ id: "-1", }))
										}}>
											removes
										</Button>
										<Button size="sm" onClick={async () => {
											dispatch(setFinish({ id: "-1" }))
										}} > toggle archives </Button>
									</HStack>)}

							</Flex>

						</li>

						{todolist.map((t: any) => {
							const dist = formatDistance(
								typeof t.updatedAt === "object" ? t.updatedAt : new Date(t.updatedAt),
								new Date(),
								{ includeSeconds: true }
							)

							return (
								<li key={t.id}>

									<Flex direction="row">
										<Checkbox isChecked={t.selected ? true : false} w="30px" size="lg" mr="1rem"
											onChange={(e) => {
												dispatch(setSelect({ id: t.id, selected: e.target.checked, }))
											}} />

										<Flex w="100%" justify="space-between" direction={{ base: "row", sm: "column", md: "row" }}>
											<Box flexGrow={1}>
												<div className={t.finished ? 'title todo-finished' : 'title'}>{t.title}</div>
												<Badge borderRadius="full" px="2" colorScheme="teal">
													{dist}
												</Badge>
											</Box>

											<HStack w="150px">
												<Button size="xs" variant="outline" colorScheme="purple" onClick={async () => {
													dispatch(setFinish({ id: t.id, finished: !t.finished, }))
												}}> archive </Button>

												<Button size="xs" variant="solid" colorScheme="red" onClick={async () => {
													dispatch(remove({ id: t.id }))
												}}> remove </Button>
											</HStack>

										</Flex>

									</Flex>
								</li>
							)
						})}

					</ul>
				</Box>

			</VStack>

		</Flex>
	);
}
export default TodoList