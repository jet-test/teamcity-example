import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dockerCompose
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2020.1"

project {

    vcsRoot(TeamcityExample)

    buildType(Puppeteer)
    buildType(Tests)
    buildType(PhpUnit)
}

object PhpUnit : BuildType({
    name = "PhpUnit"

    artifactRules = "target/codecoverage => coverage.zip"

    vcs {
        root(TeamcityExample)
    }

    steps {
        script {
            name = "PhpUnit"
            scriptContent = """
                composer install 
                phpunit -c phpunit.xml --teamcity --coverage-html target/codecoverage
            """.trimIndent()
            dockerImage = "phpunit/phpunit"
        }
    }
})

object Puppeteer : BuildType({
    name = "Puppeteer"

    vcs {
        root(TeamcityExample)
    }

    steps {
        dockerCompose {
            name = "Start web server"
            file = "docker-compose.yml"
        }
        script {
            name = "Puppeteer"
            workingDir = "puppeteer"
            scriptContent = """
                yarn install
                yarn screenshots 
                yarn jest
            """.trimIndent()
            dockerImage = "buildkite/puppeteer"
            dockerRunParameters = "--link frontend"
        }
    }
})

object Tests : BuildType({
    name = "Tests"

    type = BuildTypeSettings.Type.COMPOSITE

    vcs {
        root(TeamcityExample)

        showDependenciesChanges = true
    }

    triggers {
        vcs {
        }
    }

    dependencies {
        snapshot(PhpUnit) {
        }
        snapshot(Puppeteer) {
        }
    }
})

object TeamcityExample : GitVcsRoot({
    name = "TC-example"
    url = "https://github.com/jet-test/teamcity-example.git"
    branch = "refs/heads/php"
})
