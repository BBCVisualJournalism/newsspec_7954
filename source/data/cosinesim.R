####
# This script generates the test JSON files required by the 'Commonwealth Games Calculator' JavaScript.
####
# set your working directory
# setwd("~/Sites/bbc/news/special/2014/newsspec_7954/source/data")

# load dependencies
library(rjson)

### GENERATE TEST DATA

getCosSim <- function(age, aggression, body_awareness, communication, focus, pain_tolerance, trust, height, body_fat, power, endurance, coordination, agility, index){
    print(paste(age, aggression, body_awareness, communication, focus, pain_tolerance, trust, height, body_fat, power, endurance, coordination, agility,'end',sep=':'))
    cwgames <- read.csv("cw_games_model.csv", header=TRUE)
    
    # Every 5 years away from the ideal age range, add 1 point.
    # Up to 50 years way from the ideal age range gives the maximum +10 points.
    cwgames$idealAge <- 1
    
    cwgames$factorInAge <-
        ifelse(
            age > cwgames$age_high,
            floor((age - cwgames$age_high) / 5),
            ifelse(
                age < cwgames$age_low,
                floor((cwgames$age_low - age) / 5),
                1
            )
        )
    
    
    cwgames$factorInAggression <-
        ifelse(
            aggression > cwgames$aggression_high,
            cwgames$aggression_high,
            cwgames$aggression_low
        )
    
    cwgames$factorInBodyAwareness <-
        ifelse(
            body_awareness > cwgames$body_awareness_high,
            cwgames$body_awareness_high,
            cwgames$body_awareness_low
        )
    
    cwgames$factorInCommunication <-
        ifelse(
            communication > cwgames$communication_high,
            cwgames$communication_high,
            cwgames$communication_low
        )
    
    cwgames$factorInFocus <-
        ifelse(
            focus > cwgames$focus_high,
            cwgames$focus_high,
            cwgames$focus_low
        )
    
    cwgames$factorInPainTolerance <-
        ifelse(
            pain_tolerance > cwgames$pain_tolerance_high,
            cwgames$pain_tolerance_high,
            cwgames$pain_tolerance_low
        )
    
    cwgames$factorInTrust <-
        ifelse(
            trust > cwgames$trust_high,
            cwgames$trust_high,
            cwgames$trust_low
        )
    
    cwgames$factorInHeight <-
        ifelse(
            height > cwgames$height_high,
            cwgames$height_high,
            cwgames$height_low
        )
    
    cwgames$factorInBodyFat <-
        ifelse(
            body_fat > cwgames$body_fat_high,
            cwgames$body_fat_high,
            cwgames$body_fat_low
        )
    
    cwgames$factorInPower <-
        ifelse(
            power > cwgames$power_high,
            cwgames$power_high,
            cwgames$power_low
        )
    
    cwgames$factorInEndurance <-
        ifelse(
            endurance > cwgames$endurance_high,
            cwgames$endurance_high,
            cwgames$endurance_low
        )
    
    cwgames$factorInCoordination <-
        ifelse(
            coordination > cwgames$coordination_high,
            cwgames$coordination_high,
            cwgames$coordination_low
        )
    
    cwgames$factorInAgility <-
        ifelse(
            agility > cwgames$agility_high,
            cwgames$agility_high,
            cwgames$agility_low
        )
    
    cwgames$numerator <- (cwgames$factorInAge * cwgames$idealAge)+
                            (cwgames$factorInAggression * aggression)+
                            (cwgames$factorInBodyAwareness * body_awareness)+
                            (cwgames$factorInCommunication * communication)+
                            (cwgames$factorInFocus * focus)+
                            (cwgames$factorInPainTolerance * pain_tolerance)+
                            (cwgames$factorInTrust * trust)+
                            (cwgames$factorInHeight * height)+
                            (cwgames$factorInBodyFat * body_fat)+
                            (cwgames$factorInPower * power)+
                            (cwgames$factorInEndurance * endurance)+
                            (cwgames$factorInCoordination * coordination)+
                            (cwgames$factorInAgility * agility)
    
    cwgames$sumOfSquaredVar1 <- (cwgames$idealAge^2)+
                                    (cwgames$factorInAggression^2)+
                                    (cwgames$factorInBodyAwareness^2)+
                                    (cwgames$factorInCommunication^2)+
                                    (cwgames$factorInFocus^2)+
                                    (cwgames$factorInPainTolerance^2)+
                                    (cwgames$factorInTrust^2)+
                                    (cwgames$factorInHeight^2)+
                                    (cwgames$factorInBodyFat^2)+
                                    (cwgames$factorInPower^2)+
                                    (cwgames$factorInEndurance^2)+
                                    (cwgames$factorInCoordination^2)+
                                    (cwgames$factorInAgility^2)
    
    cwgames$sumOfSquaredVar2 <- (cwgames$factorInAge^2)+
                                    (aggression^2)+
                                    (body_awareness^2)+
                                    (communication^2)+
                                    (focus^2)+
                                    (pain_tolerance^2)+
                                    (trust^2)+
                                    (height^2)+
                                    (body_fat^2)+
                                    (power^2)+
                                    (endurance^2)+
                                    (coordination^2)+
                                    (agility^2)
    
    cwgames$score <- cwgames$numerator / (sqrt(cwgames$sumOfSquaredVar1) * sqrt(cwgames$sumOfSquaredVar2))
    
    # sort
    cwgames <- cwgames[order(cwgames$score, decreasing=FALSE),]
    output <- toJSON(as.data.frame(t(cwgames)))
    
    filename <- paste(sep = '', 'processed/testdata/', age, aggression, body_awareness, communication, focus, pain_tolerance, trust, height, body_fat, power, endurance, coordination, agility, '.json')
    
    write(output, filename)
    # return top 3 for testing methodology
    tmpdata <- head(cwgames,3)
    return(as.vector(tmpdata[,1])[index])
} #end of function

appcs1 <- function(a) {
    return(getCosSim(a['age'],a['aggression'],a['body_awareness'],a['communication'],a['focus'],a['pain_tolerance'],a['trust'],a['height'],a['body_fat'],a['power'],a['endurance'],a['coordination'],a['agility'],1))
}
appcs2 <- function(a) {
    return(getCosSim(a['age'],a['aggression'],a['body_awareness'],a['communication'],a['focus'],a['pain_tolerance'],a['trust'],a['height'],a['body_fat'],a['power'],a['endurance'],a['coordination'],a['agility'],2))
}
appcs2 <- function(a) {
    return(getCosSim(a['age'],a['aggression'],a['body_awareness'],a['communication'],a['focus'],a['pain_tolerance'],a['trust'],a['height'],a['body_fat'],a['power'],a['endurance'],a['coordination'],a['agility'],3))
}

cwgames_testcasecs <- read.csv('cw_games_test_cases.csv')
cwgames_testcasecs$applied1 <- apply(cwgames_testcasecs,1,appcs1)

head(cwgames_testcasecs[,c('case_id', 'applied1')])
tail(cwgames_testcasecs[,c('case_id', 'applied1')])

cwgames_testcasecs$applied2 <- apply(cwgames_testcasecs,1,appcs2)
cwgames_testcasecs$applied3 <- apply(cwgames_testcasecs,1,appcs3)
tail(cwgames_testcasecs)

head(cwgames_testcasecs)
tail(cwgames_testcasecs)

# John 101 -netball
getCosSim(35, 5,5,7,8,3,6,6,5,4,7,8,4)
# Ransome 102 -wrestling
getCosSim(28, 6,7,6,8,6,4,6,6,6,7,6,7)
# Dom 103 - hockey
getCosSim(35, 6,7,7,7,7,7,5,6,6,7,8,7)
# Chris A 104 - hockey
getCosSim(84, 4,6,6,8,5,8,6,6,6,5,4,8)
# Chris J 105 - hockey
getCosSim(35, 4,8,6,9,7,7,3,4,5,9,5,8)

# this is for hockey
getCosSim(20,5,4,10,6,6,9,4,4,5,7,8,8) 