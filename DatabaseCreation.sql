-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Company` (
  `CompanyName` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`CompanyName`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Users` (
  `idUsers` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `firstNames` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `Company_CompanyName` VARCHAR(255) NULL,
  PRIMARY KEY (`idUsers`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_Users_Company_idx` (`Company_CompanyName` ASC) VISIBLE,
  CONSTRAINT `fk_Users_Company`
    FOREIGN KEY (`Company_CompanyName`)
    REFERENCES `mydb`.`Company` (`CompanyName`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`UserSkills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`UserSkills` (
  `Skill` VARCHAR(255) NOT NULL,
  `Users_idUsers` INT NOT NULL,
  PRIMARY KEY (`Skill`, `Users_idUsers`),
  INDEX `fk_UserSkills_Users1_idx` (`Users_idUsers` ASC) VISIBLE,
  CONSTRAINT `fk_UserSkills_Users1`
    FOREIGN KEY (`Users_idUsers`)
    REFERENCES `mydb`.`Users` (`idUsers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Jobs` (
  `idJobs` INT NOT NULL AUTO_INCREMENT,
  `Company_CompanyName` VARCHAR(255) NOT NULL,
  `jobTitle` MEDIUMTEXT NOT NULL,
  `jobDescription` MEDIUMTEXT NOT NULL,
  `payRangeLower` DECIMAL(15,2) NOT NULL,
  `payRangeUpper` DECIMAL(15,2) NULL,
  `minimumExperience` MEDIUMTEXT NULL,
  PRIMARY KEY (`idJobs`),
  INDEX `fk_Jobs_Company1_idx` (`Company_CompanyName` ASC) VISIBLE,
  CONSTRAINT `fk_Jobs_Company1`
    FOREIGN KEY (`Company_CompanyName`)
    REFERENCES `mydb`.`Company` (`CompanyName`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Job Applications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Job Applications` (
  `idJob Applications` INT NOT NULL AUTO_INCREMENT,
  `Jobs_idJobs` INT NOT NULL,
  `Users_idUsers` INT NOT NULL,
  `cV` BLOB NOT NULL,
  `coverLetter` BLOB NOT NULL,
  `denied` TINYINT NOT NULL,
  PRIMARY KEY (`idJob Applications`),
  INDEX `fk_Job Applications_Jobs1_idx` (`Jobs_idJobs` ASC) VISIBLE,
  INDEX `fk_Job Applications_Users1_idx` (`Users_idUsers` ASC) VISIBLE,
  CONSTRAINT `fk_Job Applications_Jobs1`
    FOREIGN KEY (`Jobs_idJobs`)
    REFERENCES `mydb`.`Jobs` (`idJobs`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Job Applications_Users1`
    FOREIGN KEY (`Users_idUsers`)
    REFERENCES `mydb`.`Users` (`idUsers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`JobQualifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`JobQualifications` (
  `idJobQualifications` VARCHAR(256) NOT NULL,
  `Jobs_idJobs` INT NOT NULL,
  PRIMARY KEY (`idJobQualifications`, `Jobs_idJobs`),
  INDEX `fk_JobQualifications_Jobs1_idx` (`Jobs_idJobs` ASC) VISIBLE,
  CONSTRAINT `fk_JobQualifications_Jobs1`
    FOREIGN KEY (`Jobs_idJobs`)
    REFERENCES `mydb`.`Jobs` (`idJobs`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`JobSkills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`JobSkills` (
  `Skill` VARCHAR(256) NOT NULL,
  `Jobs_idJobs` INT NOT NULL,
  PRIMARY KEY (`Skill`, `Jobs_idJobs`),
  INDEX `fk_JobSkills_Jobs1_idx` (`Jobs_idJobs` ASC) VISIBLE,
  CONSTRAINT `fk_JobSkills_Jobs1`
    FOREIGN KEY (`Jobs_idJobs`)
    REFERENCES `mydb`.`Jobs` (`idJobs`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`user` (
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(32) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP);

CREATE USER 'user1' IDENTIFIED BY 'test';

GRANT SELECT ON TABLE `mydb`.* TO 'user1';
GRANT SELECT, INSERT, TRIGGER ON TABLE `mydb`.* TO 'user1';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE `mydb`.* TO 'user1';
GRANT EXECUTE ON ROUTINE `mydb`.* TO 'user1';
GRANT ALL ON `mydb`.* TO 'user1';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
