####
# This script generates the test JSON files required by the 'Commonwealth Games Calculator' JavaScript.
####
# set your working directory
# setwd("~/Sites/bbc/news/special/2014/newsspec_7954/source/data")

# load dependencies
library(rjson)

### GENERATE TEST DATA

generateTestJSON <- function(age, aggression, body_awareness, communication, focus, pain_tolerance, trust, height, body_fat, power, endurance, coordination, agility, index){
    print(paste(age, aggression, body_awareness, communication, focus, pain_tolerance, trust, height, body_fat, power, endurance, coordination, agility,'end',sep=':'))
  cwgames <- read.csv("cw_games_model.csv", header=TRUE)
#   cwgames <- read.csv("scores_remodel.csv", header=TRUE)
  
  # Every 5 years away from the ideal age range, add 1 point.
  # Up to 50 years way from the ideal age range gives the maximum +10 points.
  cwgames$factorInAge <-
    ifelse(
      age > cwgames$age_high,
      floor((age - cwgames$age_high) / 5),
      ifelse(
        age < cwgames$age_low,
        floor((cwgames$age_low - age) / 5),
        0
      )
    )
  
  cwgames$factorInAggression <-
      ifelse(
        aggression > cwgames$aggression_high,
        (aggression - cwgames$aggression_high)^2,
        ifelse(
          aggression < cwgames$aggression_low,
          (cwgames$aggression_low - aggression)^2,
          0
        )
      )

cwgames$factorInBodyAwareness <-
  ifelse(
    body_awareness > cwgames$body_awareness_high,
    (body_awareness - cwgames$body_awareness_high)^2,
    ifelse(
      body_awareness < cwgames$body_awareness_low,
      (cwgames$body_awareness_low - body_awareness)^2,
      0
    )
  )

cwgames$factorInCommunication <-
  ifelse(
    communication > cwgames$communication_high,
    (communication - cwgames$communication_high)^2,
    ifelse(
      communication < cwgames$communication_low,
      (cwgames$communication_low - communication)^2,
      0
    )
  )

cwgames$factorInFocus <-
  ifelse(
    focus > cwgames$focus_high,
    (focus - cwgames$focus_high)^2,
    ifelse(
      focus < cwgames$focus_low,
      (cwgames$focus_low - focus)^2,
      0
    )
  )

cwgames$factorInPainTolerance <-
  ifelse(
    pain_tolerance > cwgames$pain_tolerance_high,
    (pain_tolerance - cwgames$pain_tolerance_high)^2,
    ifelse(
      pain_tolerance < cwgames$pain_tolerance_low,
      (cwgames$pain_tolerance_low - pain_tolerance)^2,
      0
    )
  )

cwgames$factorInTrust <-
  ifelse(
    trust > cwgames$trust_high,
    (trust - cwgames$trust_high)^2,
    ifelse(
      trust < cwgames$trust_low,
      (cwgames$trust_low - trust)^2,
      0
    )
  )

cwgames$factorInHeight <-
  ifelse(
    height > cwgames$height_high,
    (height - cwgames$height_high)^2,
    ifelse(
      height < cwgames$height_low,
      (cwgames$height_low - height)^2,
      0
    )
  )

cwgames$factorInBodyFat <-
  ifelse(
    body_fat > cwgames$body_fat_high,
    (body_fat - cwgames$body_fat_high)^2,
    ifelse(
      body_fat < cwgames$body_fat_low,
      (cwgames$body_fat_low - body_fat)^2,
      0
    )
  )

cwgames$factorInPower <-
  ifelse(
    power > cwgames$power_high,
    (power - cwgames$power_high)^2,
    ifelse(
      power < cwgames$power_low,
      (cwgames$power_low - power)^2,
      0
    )
  )

cwgames$factorInEndurance <-
  ifelse(
    endurance > cwgames$endurance_high,
    (endurance - cwgames$endurance_high)^2,
    ifelse(
      endurance < cwgames$endurance_low,
      (cwgames$endurance_low - endurance)^2,
      0
    )
  )

cwgames$factorInCoordination <-
  ifelse(
    coordination > cwgames$coordination_high,
    (coordination - cwgames$coordination_high)^2,
    ifelse(
      coordination < cwgames$coordination_low,
      (cwgames$coordination_low - coordination)^2,
      0
    )
  )

cwgames$factorInAgility <-
  ifelse(
    agility > cwgames$agility_high,
    (agility - cwgames$agility_high)^2,
    ifelse(
      agility < cwgames$agility_low,
      (cwgames$agility_low - agility)^2,
      0
    )
  )

  cwgames$score <- 
    cwgames$factorInAge +
    cwgames$factorInAggression +
    cwgames$factorInBodyAwareness +
    cwgames$factorInCommunication +
    cwgames$factorInFocus +
    cwgames$factorInPainTolerance +
    cwgames$factorInTrust +
    cwgames$factorInHeight +
    cwgames$factorInBodyFat +
    cwgames$factorInPower +
    cwgames$factorInEndurance +
    cwgames$factorInCoordination +
    cwgames$factorInAgility
  
  # sort
  cwgames <- cwgames[order(cwgames$score, decreasing=FALSE),]
  output <- toJSON(as.data.frame(t(cwgames)))
  
  filename <- paste(sep = '', 'processed/testdata/', age, aggression, body_awareness, communication, focus, pain_tolerance, trust, height, body_fat, power, endurance, coordination, agility, '.json')

  write(output, filename)
    # return top 3 for testing methodology
    tmpdata <- head(cwgames,3)
  return(as.vector(tmpdata[,1])[index])
} #end of function

applied1 <- function(a) {
    return(generateTestJSON(as.numeric(a['age']),
                            as.numeric(a['aggression']),
                            as.numeric(a['body_awareness']),
                            as.numeric(a['communication']),
                            as.numeric(a['focus']),
                            as.numeric(a['pain_tolerance']),
                            as.numeric(a['trust']),
                            as.numeric(a['height']),
                            as.numeric(a['body_fat']),
                            as.numeric(a['power']),
                            as.numeric(a['endurance']),
                            as.numeric(a['coordination']),
                            as.numeric(a['agility']),
                            1))
}
applied2 <- function(a) {
    return(generateTestJSON(as.numeric(a['age']),
                            as.numeric(a['aggression']),
                            as.numeric(a['body_awareness']),
                            as.numeric(a['communication']),
                            as.numeric(a['focus']),
                            as.numeric(a['pain_tolerance']),
                            as.numeric(a['trust']),
                            as.numeric(a['height']),
                            as.numeric(a['body_fat']),
                            as.numeric(a['power']),
                            as.numeric(a['endurance']),
                            as.numeric(a['coordination']),
                            as.numeric(a['agility']),
                            2))
}
applied3 <- function(a) {
    return(generateTestJSON(as.numeric(a['age']),
                            as.numeric(a['aggression']),
                            as.numeric(a['body_awareness']),
                            as.numeric(a['communication']),
                            as.numeric(a['focus']),
                            as.numeric(a['pain_tolerance']),
                            as.numeric(a['trust']),
                            as.numeric(a['height']),
                            as.numeric(a['body_fat']),
                            as.numeric(a['power']),
                            as.numeric(a['endurance']),
                            as.numeric(a['coordination']),
                            as.numeric(a['agility']),
                            3))
}

cwgames_testcase <- read.csv('uow/cw_games_test_cases.csv')
cwgames_testcase$applied1 <- apply(cwgames_testcase,1,applied1)
cwgames_testcase$applied2 <- apply(cwgames_testcase,1,applied2)
cwgames_testcase$applied3 <- apply(cwgames_testcase,1,applied3)
write.csv(cwgames_testcase, '__euclidean_distance_result.csv', row.names=FALSE)
head(cwgames_testcase)


# # John 101 -netball
# generateTestJSON(35, 5,5,7,8,3,6,6,5,4,7,8,4)[1]
# # Ransome 102 -wrestling
# generateTestJSON(28, 6,7,6,8,6,4,6,6,6,7,6,7)
# # Dom 103 - hockey
# generateTestJSON(35, 6,7,7,7,7,7,5,6,6,7,8,7)
# # Chris A 104 - hockey
# generateTestJSON(84, 4,6,6,8,5,8,6,6,6,5,4,8)
# # Chris J 105 - hockey
# generateTestJSON(35, 4,8,6,9,7,7,3,4,5,9,5,8)
# # definitely hockey
generateTestJSON(20,5,4,10,6,6,9,4,4,5,7,8,8)

