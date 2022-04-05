import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa'
import {
  ChakraProvider,
  Container,
  Heading,
  Box,
  Flex,
  Spacer,
  Text,
  Center,
  theme,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from '@chakra-ui/react'
import axios from 'axios'
import { ColorModeSwitcher } from "./ColorModeSwitcher"

function App() {
  const [selectedStudent, setSelectedStudent] = useState(0)
  const [students, setStudents] = useState([])
  const [scores, setScores] = useState([])
  const [scoreHash, setScoreHash] = useState({})
  
  /**
   * Data apis
   */
  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/students')
      setStudents(data)
      setSelectedStudent(data[0].id)
    } catch(e) {
      console.log(e)
    }
  }

  const fetchScores = async (studentId) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/students/${studentId}`)
      const studentScores = data.map(item => ({
          scoreId: item.id,
          className: item.Class.name,
          score: item.score
        }
      ));

      setScores(studentScores)
    } catch(e) {
      console.log(e)
    } 
  }

  const updateScore = async () => {
    try {
      await axios.patch(`http://localhost:8080/api/scores/student`, {
        scores: scoreHash
      })
    } catch(e) {
      console.log(e)
    }
  }

  /**
   * useEffect
   */
  useEffect(() => {
    fetchStudents()
  }, []);

  useEffect(() => {
    if (selectedStudent)
      fetchScores(selectedStudent)
  }, [selectedStudent])

  /**
   * EventHandlers
   */
  const handleStudentClick = (id) => {
    setSelectedStudent(id)
  }

  const handleScoreChange = (scoreId, val) => {
    const score = scoreHash
    score[scoreId] = val

    setScoreHash(score)
  }

  const handleSave = () => {
    updateScore()

    // reset scoreHash
    setScoreHash({})
  }

  return (
    <ChakraProvider theme={theme}>
      <Container
        maxW="2xl"
        border
        borderColor="cyan.600"
        borderWidth={1}
        borderRadius="lg"
        mt="10"
        p="8"
      >
        <Center>
          <Heading size="lg">Test results</Heading>
        </Center>
        <Flex mt="10" justifyContent="space-between" direction={["column", "row"]}>
          <Box p={4} bg="gray.100" width={['100%', 200]} borderRadius={6} mb={6}>
            {
              students.map((student) => {
                return (
                  <Box key={student.id} mb={2}>
                    <Text
                      fontSize='xl'
                      color={student.id === selectedStudent ? 'blue.400': 'gray.600'}
                      onClick={() => handleStudentClick(student.id)}
                    >
                      {student.name}
                    </Text>
                  </Box>
                )
              })
            }
          </Box>
          <Box>
            {
              scores.map((score) => {
                return (
                  <Flex key={score.scoreId} mb="4" alignItems="center">
                    <Text fontSize="xl" width={100}>{score.className}</Text>
                    <NumberInput
                      max={100}
                      keepWithinRange={false}
                      clampValueOnBlur={false}
                      defaultValue={score.score}
                      onChange={(val) => handleScoreChange(score.scoreId, val)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Flex>
                )
              })
            }
            <Flex>
              <Spacer />
              <Button onClick={() => handleSave()} leftIcon={<FaSave />}  alignSelf='flex-end' colorScheme='teal' variant='solid' size="md">Save</Button>
            </Flex>
          </Box>
          
        </Flex>
        <ColorModeSwitcher position="absolute" top="0" right="10" />
      </Container>
    </ChakraProvider>
  );
}

export default App;
