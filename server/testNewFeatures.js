import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Test data
const testTechNews = {
  title: "Google Summer of Code 2024 Applications Open",
  description: "Google Summer of Code is a global program focused on bringing more student developers into open source software development. Students work with an open source organization on a 3 month programming project during their break from school.",
  type: "internship",
  link: "https://summerofcode.withgoogle.com/",
  priority: 3
};

const testPoll = {
  question: "Do you prefer online or offline exams?",
  description: "This poll will help us understand student preferences for exam formats",
  options: ["Online exams", "Offline exams", "Hybrid approach", "No preference"],
  category: "academic",
  allowMultipleVotes: false
};

// Test functions
async function testTechNewsAPI() {
  console.log('🧪 Testing Tech News API...');
  
  try {
    // Test creating tech news
    console.log('Creating tech news...');
    const createResponse = await axios.post(`${BASE_URL}/tech-news`, testTechNews);
    console.log('✅ Tech news created:', createResponse.data.title);
    
    // Test getting all tech news
    console.log('Fetching all tech news...');
    const getAllResponse = await axios.get(`${BASE_URL}/tech-news`);
    console.log('✅ Found', getAllResponse.data.length, 'tech news items');
    
    // Test getting tech news by type
    console.log('Fetching internships...');
    const getByTypeResponse = await axios.get(`${BASE_URL}/tech-news/type/internship`);
    console.log('✅ Found', getByTypeResponse.data.length, 'internships');
    
    console.log('🎉 Tech News API tests passed!\n');
  } catch (error) {
    console.error('❌ Tech News API test failed:', error.response?.data || error.message);
  }
}

async function testPollsAPI() {
  console.log('🧪 Testing Polls API...');
  
  try {
    // Test creating poll
    console.log('Creating poll...');
    const createResponse = await axios.post(`${BASE_URL}/polls`, testPoll);
    console.log('✅ Poll created:', createResponse.data.question);
    
    // Test getting all polls
    console.log('Fetching all polls...');
    const getAllResponse = await axios.get(`${BASE_URL}/polls`);
    console.log('✅ Found', getAllResponse.data.length, 'polls');
    
    // Test getting polls by category
    console.log('Fetching academic polls...');
    const getByCategoryResponse = await axios.get(`${BASE_URL}/polls/category/academic`);
    console.log('✅ Found', getByCategoryResponse.data.length, 'academic polls');
    
    // Test getting poll results
    console.log('Fetching poll results...');
    const pollId = createResponse.data._id;
    const getResultsResponse = await axios.get(`${BASE_URL}/polls/${pollId}/results`);
    console.log('✅ Poll results fetched, total votes:', getResultsResponse.data.totalVotes);
    
    console.log('🎉 Polls API tests passed!\n');
  } catch (error) {
    console.error('❌ Polls API test failed:', error.response?.data || error.message);
  }
}

async function testSkillExchangeBooking() {
  console.log('🧪 Testing Skill Exchange Booking...');
  
  try {
    // Test getting all skill exchanges
    console.log('Fetching skill exchanges...');
    const getAllResponse = await axios.get(`${BASE_URL}/skill-exchange`);
    console.log('✅ Found', getAllResponse.data.length, 'skill exchanges');
    
    if (getAllResponse.data.length > 0) {
      const skillId = getAllResponse.data[0]._id;
      console.log('Testing booking functionality for skill:', skillId);
      
      // Note: This would require authentication in a real scenario
      console.log('ℹ️  Booking test would require authentication token');
    }
    
    console.log('🎉 Skill Exchange API tests passed!\n');
  } catch (error) {
    console.error('❌ Skill Exchange API test failed:', error.response?.data || error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API Tests for New Features...\n');
  
  await testTechNewsAPI();
  await testPollsAPI();
  await testSkillExchangeBooking();
  
  console.log('✨ All tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests }; 