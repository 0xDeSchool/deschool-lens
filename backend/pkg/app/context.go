package app

type ConfigureFunc = func() error
type RunFunc = func() error

type runFunInfo struct {
	order int
	run   RunFunc
}

func NewRun(r RunFunc) runFunInfo {
	return runFunInfo{
		run:   r,
		order: 0,
	}
}

type AppContext struct {
	PreRuns  []runFunInfo
	Runs     []runFunInfo
	PostRuns []runFunInfo

	Name        string
	Short       string
	Description string
	Version     string
}

func NewAppContext() *AppContext {
	return &AppContext{
		PreRuns:  make([]runFunInfo, 0),
		Runs:     make([]runFunInfo, 0),
		PostRuns: make([]runFunInfo, 0),
	}
}

func (a *AppContext) PreRun(action RunFunc) {
	a.PreRuns = append(a.PreRuns, NewRun(action))
}

func (a *AppContext) PreOrderRun(order int, action RunFunc) {
	a.PreRuns = append(a.PreRuns, runFunInfo{
		run:   action,
		order: order,
	})
}

func (a *AppContext) Run(action RunFunc) {
	a.Runs = append(a.Runs, NewRun(action))
}

func (a *AppContext) OrderRun(order int, action RunFunc) {
	a.Runs = append(a.Runs, runFunInfo{
		run:   action,
		order: order,
	})
}

func (a *AppContext) PostRun(action RunFunc) {
	a.PostRuns = append(a.PostRuns, NewRun(action))
}

func (a *AppContext) PostOrderRun(order int, action RunFunc) {
	a.PostRuns = append(a.PostRuns, runFunInfo{
		run:   action,
		order: order,
	})
}
