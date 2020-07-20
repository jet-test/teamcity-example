tasks.register("printProperty") {
    doLast {
        val myParam: String by project
        val teamcity: Map<*,*> by project
        println("my param value: $myParam")
        println("my param value: ${project.property("my.param")}")
        println("my param value: ${teamcity["myParam"]}")
        println("my param value: ${teamcity["my.param"]}")
        println("teamcity: ${teamcity["teamcity.build.id"]}")
    }
}