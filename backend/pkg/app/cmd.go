package app

import (
	"sort"

	"github.com/spf13/cobra"
)

type CommandBuilder struct {
	RootCmd *cobra.Command
}

func NewCommandBuilder() *CommandBuilder {
	cb := &CommandBuilder{
		RootCmd: &cobra.Command{},
	}
	return cb
}

func (cb *CommandBuilder) Build(ac *AppContext) (*cobra.Command, error) {
	cb.RootCmd.Use = ac.Name
	cb.RootCmd.Short = ac.Short
	cb.RootCmd.Long = ac.Description
	cb.RootCmd.PersistentPreRunE = func(cmd *cobra.Command, args []string) error {
		return preRunApp(cmd, ac)
	}
	cb.RootCmd.RunE = func(cmd *cobra.Command, args []string) error {
		return runApp(ac)
	}
	cb.RootCmd.PersistentPostRunE = func(cmd *cobra.Command, args []string) error {
		return postRunApp(ac)
	}
	err := configureApp(cb.RootCmd, ac)
	if err != nil {
		return nil, err
	}
	return cb.RootCmd, nil
}

func (b *CommandBuilder) AddCommand(cmd *cobra.Command) {
	b.RootCmd.AddCommand(cmd)
}

func (b *CommandBuilder) AddRun(use string, short string, run func()) {
	b.RootCmd.AddCommand(&cobra.Command{
		Use:   use,
		Short: short,
		Run:   func(cmd *cobra.Command, args []string) { run() },
	})
}

func configureApp(cmd *cobra.Command, ac *AppContext) error {
	cmd.PersistentFlags().StringP("config", "c", "", "config file")
	return nil
}

func preRunApp(cmd *cobra.Command, ac *AppContext) error {
	cfgfile, err := cmd.Flags().GetString("config")
	if err == nil {
		initConfig(cfgfile)
	}
	readConfig()
	sort.SliceStable(ac.PreRuns, func(i, j int) bool { return ac.PreRuns[i].order < ac.PreRuns[j].order })
	for _, run := range ac.PreRuns {
		run.run()
	}
	return nil
}

func runApp(ac *AppContext) error {
	sort.SliceStable(ac.Runs, func(i, j int) bool { return ac.Runs[i].order < ac.Runs[j].order })
	for _, run := range ac.Runs {
		if err := run.run(); err != nil {
			return err
		}
	}
	return nil
}

func postRunApp(ac *AppContext) error {
	sort.SliceStable(ac.PostRuns, func(i, j int) bool { return ac.PostRuns[i].order < ac.PostRuns[j].order })
	for _, run := range ac.PostRuns {
		run.run()
	}
	return nil
}
