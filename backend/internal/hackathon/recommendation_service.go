package hackathon

import (
	"context"

	"github.com/0xdeschool/deschool-lens/backend/pkg/errx"
	"github.com/0xdeschool/deschool-lens/backend/pkg/utils/linq"
)

func (hm *HackathonManager) RunRecommendations(ctx context.Context, address string) *UserRecommendation {
	q11eList := hm.q11eRepo.GetAll(ctx)
	var fromQ11e *Q11e
	var recommendation *UserRecommendation
	var highestScore int

	// Find self q11e
	for _, q11e := range q11eList {
		if q11e.Address == address {
			fromQ11e = &q11e
			break
		}
	}
	if fromQ11e == nil {
		errx.Panic("address hasn't filled a questionnaire yet, please fill the form first!")
		return nil
	}

	// Find the pair
	for _, q11e := range q11eList {
		if q11e.Address == address {
			continue
		}
		ur := hm.compareTwoId(ctx, *fromQ11e, q11e)
		if ur.Score > highestScore {
			highestScore = ur.Score
			recommendation = ur
		}
	}
	if recommendation == nil {
		errx.Panic("The application's questionnaire stamps are not enough to give a convincing recommendation, please come back later and thanks for your support!")
		return nil
	}
	return recommendation

}

var MBTI_MATCHING_MAP = [16][16]int{
	{8, 8, 8, 10, 8, 10, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2},
	{8, 8, 10, 8, 10, 8, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2},
	{8, 10, 8, 8, 8, 8, 8, 10, 2, 2, 2, 2, 2, 2, 2, 2},
	{10, 8, 8, 8, 8, 8, 8, 8, 10, 2, 2, 2, 2, 2, 2, 2},
	{8, 10, 8, 8, 8, 8, 8, 10, 6, 6, 6, 6, 4, 4, 4, 4},
	{10, 8, 8, 8, 8, 8, 10, 8, 6, 6, 6, 6, 6, 6, 6, 6},
	{8, 8, 8, 8, 8, 10, 8, 8, 6, 6, 6, 6, 4, 4, 4, 10},
	{8, 8, 10, 8, 10, 8, 8, 8, 6, 6, 6, 6, 4, 4, 4, 4},

	{2, 2, 2, 10, 6, 6, 6, 6, 4, 4, 4, 4, 6, 10, 6, 10},
	{2, 2, 2, 2, 6, 6, 6, 6, 4, 4, 4, 4, 10, 6, 10, 6},
	{2, 2, 2, 2, 6, 6, 6, 6, 4, 4, 4, 4, 6, 10, 6, 10},
	{2, 2, 2, 2, 6, 6, 6, 6, 4, 4, 4, 4, 10, 6, 10, 6},

	{2, 2, 2, 2, 4, 6, 4, 4, 6, 10, 6, 10, 8, 8, 8, 8},
	{2, 2, 2, 2, 4, 6, 4, 4, 10, 6, 10, 6, 8, 8, 8, 8},
	{2, 2, 2, 2, 4, 6, 4, 4, 6, 10, 6, 10, 8, 8, 8, 8},
	{2, 2, 2, 2, 4, 6, 10, 4, 10, 6, 10, 6, 8, 8, 8, 8},
}

func (hm *HackathonManager) compareTwoId(ctx context.Context, fromQ11e Q11e, toQ11e Q11e) *UserRecommendation {

	score := 0
	ur := &UserRecommendation{
		FromAddr: fromQ11e.Address,
		ToAddr:   toQ11e.Address,
		Reasons:  []string{},
	}

	// Goals match
	score += getSameAndScore(fromQ11e.Goals, toQ11e.Goals, "goal", ur)

	// Fields match
	score += getSameAndScore(fromQ11e.Fields, toQ11e.Fields, "field", ur)

	// Belief match
	score += getSameAndScore(fromQ11e.Belief, toQ11e.Belief, "belief", ur)

	// Mbti match
	delta := MBTI_MATCHING_MAP[fromQ11e.Mbti][toQ11e.Mbti]
	score += delta
	var reasonStr string
	if 4 <= score && score <= 8 {
		reasonStr = "Your characters fit each other according to MBTi personality theory."
	} else if 8 < score {
		reasonStr = "Your characters perfectly fit each other according to MBTi personality theory."
	}
	ur.Reasons = append(ur.Reasons, reasonStr)
	ur.Score = score

	return ur
}

func getSameAndScore(fromItems []string, toItems []string, fieldName string, ur *UserRecommendation) int {
	sameItemCnt := 0
	delta := 0
	var sameItemArr []string
	for _, item := range fromItems {
		if linq.Contains(toItems, &item) {
			sameItemCnt += 1
			sameItemArr = append(sameItemArr, item)
		}
	}

	if sameItemCnt > 0 {
		if sameItemCnt > 2 {
			delta += 30
		} else {
			delta += 20
		}
		reasonStr := ""
		for _, sameItem := range sameItemArr {
			reasonStr = reasonStr + sameItem + ", "
		}
		if len(reasonStr) >= 2 {
			reasonStr = reasonStr[:len(reasonStr)-2]
		}
		containS := ""
		if sameItemCnt > 1 {
			containS = "s"
		}
		ur.Reasons = append(ur.Reasons, "You both have the same "+fieldName+containS+": "+reasonStr+".")
	}
	return delta
}