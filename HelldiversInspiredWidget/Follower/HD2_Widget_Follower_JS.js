// Get Document (HTML)
const d = document;

// Get Elements of the Document (HTML)
const xpFill = d.getElementById("xpFill");
const xpText = d.getElementById("xpText");
const levelText = d.getElementById("levelText");
const usernameText = d.getElementById("usernameText");

// Initialization of variables to use : Level, xp, xpGoal
let level = 1;
let xp = 0;
let xpGoal = 100;
let username = "___";

// Array For Levels Goals
const levelsGoals = [10,25,50,75,100,150,200,250,300,350,400,450,500];

// Update
function updateUI() 
{
  // Follower Needed to Level UP (Actual Goal - Previous Goal)
  const previousGoal = levelsGoals[level - 2];
  const nextGoal = xpGoal;

  // Calcul Percent (Actual Goal - Previous Goal / Only follower needed to Level UP)
    const progress = Math.max(0, Math.min(((xp - previousGoal) / (nextGoal - previousGoal)) * 100, 100));

  // // Calcul Percent (All time Follower / Actual Goal Level)
  //const progress = Math.max(0, Math.min(xp / xpGoal * 100, 100));
  
  // Fill Progress Bar
  xpFill.style.width = progress + "%";
  
  // Set Text above Progress Bar to show Progression
  xpText.innerText = xp + `/` + xpGoal;

  // Set Text above Progress Bar to show Level of Progression
  levelText.innerText = `Niveau ` + level;

  // Set Text above Everything to show Last Follower
  usernameText.innerText = username;
}

// Level Up or Down
function adjustLevel() 
{
  // Level UP
  while (level <= levelsGoals.length && xp >= levelsGoals[level - 1]) 
  {
    level++;
  }

  // Level Down
  while (level > 1 && xp < levelsGoals[level - 2]) 
  {
    level--;
  }

  // Update xpGoal
  xpGoal = levelsGoals[level - 1] || levelsGoals[levelsGoals.length - 1];

  // Call Update
  updateUI();
}

// Event Listener At Load
window.addEventListener('onWidgetLoad', function(obj) 
{
  // Twitch Data
  const session = obj.detail.session.data;

  // Field Data
  const fieldData = obj.detail.fieldData;

  // Actual XP based on Total Follower
  xp = session["follower-total"].count;

  // Compute starting level based on total followers
  for (let i = 0; i < levelsGoals.length; i++) 
  {
    if (xp >= levelsGoals[i]) 
    {
      level = i + 2;
    }
  }

  // Set correct goal
  xpGoal = levelsGoals[level - 1] || levelsGoals[levelsGoals.length - 1];

  // Last follower for display
  if (session["follower-latest"]) 
  {
    username = session["follower-latest"].name;
  }

  // Call Update
  updateUI();
});

// Event Listener At Received
window.addEventListener('onEventReceived', function(obj) 
{
  // Check if Null
  if (!obj.detail.event) return;
  
  // Get Event Type
  const eventType = obj.detail.listener;

  // If New Follower ---> xp UP
  if (eventType === "follower-latest") 
  {
    username = obj.detail.event.name;
    xp++;
    adjustLevel();
  }

  // // // Not Signaled by Twitch API, Maybe Need a Custom Tools and Data Base to do it
});